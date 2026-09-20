const Feedback = require("../models/Feedback");
const { feedbackQueue } = require("../config/queue");

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

module.exports = {createFeedback, getFeedbacks, getFeedbackById, updateFeedback, deleteFeedback};