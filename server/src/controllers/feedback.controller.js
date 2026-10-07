const Feedback = require("../models/Feedback");
const { feedbackQueue } = require("../config/queue");
const { embedText, answerQuestion } = require("../services/ai.service");

//POST
const createFeedback = async (req, res) =>{
    try{
        const {text, source} = req.body;
        if (!text){
            return res.status(400).json({message:"All fields are required"});
        }

        const feedback = await Feedback.create({text, source, createdby: req.user._id});
        await feedbackQueue.add(
            "analyze", 
            {feedbackId: feedback._id.toString()},
            {attempts: 3, backoff: {type: "exponential", delay: 2000}}
        );
        res.status(201).json(feedback);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

//GET
const getFeedbacks = async(req, res) =>{
    try{
        const feedbacks = await Feedback.find({ createdby: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

//GET  /:id
const getFeedbackById = async(req, res) =>{
    try{
        const feedback = await Feedback.findById(req.params.id);
    
        if (!feedback){
            return res.status(404).json({message: "Feedback not found"});
        }
        if (feedback.createdby.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Not authorized to view this"});
        }
        res.status(200).json(feedback);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

//PUT
const updateFeedback = async (req, res) =>{
    try{
        console.log("PUT body received:", req.body);l
        const feedback = await Feedback.findById(req.params.id);
        if(!feedback){
            return res.status(404).json({message: "Feedback not found"});
        }
        if(feedback.createdby.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Not authorized to update this"});
        }
        feedback.text = req.body.text || feedback.text;
        feedback.source = req.body.source || feedback.source;
        const updated = await feedback.save();
        res.status(200).json(updated);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

//DELETE
const deleteFeedback = async (req, res) =>{
    try{
        const feedback = await Feedback.findById(req.params.id);
        if(!feedback){
            return res.status(404).json({message: "Feedback not found"});
        }
        if(feedback.createdby.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Not authorized to delete this"});
        }
        await feedback.deleteOne();
        res.status(200).json({message: "Feedback deleted"});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

const askQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ message: "A question is required" });
        }

        // 1. Embed the question into the SAME 768-vector space as the feedback
        const questionEmbedding = await embedText(question);

        // 2. Vector search: find the 5 feedback entries closest in meaning
        const results = await Feedback.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: questionEmbedding,
                    numCandidates: 100,
                    limit: 5,
                },
            },
            {
                $project: {
                    _id: 0,
                    text: 1,
                    sentiment: 1,
                    score: { $meta: "vectorSearchScore" },
                },
            },
        ]);

        if (results.length === 0) {
            return res.status(200).json({
                answer: "I don't have any feedback data to answer that yet.",
                sources: [],
            });
        }

        // 3. Build the context block from the retrieved feedback
        const context = results
            .map((r, i) => `${i + 1}. (${r.sentiment}) ${r.text}`)
            .join("\n");

        // 4. Ask Gemini, grounded ONLY in that context
        const answer = await answerQuestion(question, context);

        // 5. Return the answer + the sources it used
        res.status(200).json({ answer, sources: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {createFeedback, getFeedbacks, getFeedbackById, updateFeedback, deleteFeedback, askQuestion};