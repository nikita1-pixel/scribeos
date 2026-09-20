require('dotenv').config();
const { Worker } = require("bullmq");
const connectDB = require("../config/db");
const { connection } = require("../config/queue");
const Feedback = require("../models/Feedback");

connectDB();

const worker = new Worker(
    'feedback-analysis',
    async (job) =>{

        console.log(`Processing job ${job.id} (${job.name})`);

        const feedback = await Feedback.findById(job.data.feedbackId);
        if(!feedback){
            throw new error (`Feedback ${job.data.feedback} not found`);
        }
        console.log(` Analyzing : ${feedback.text}`);

        await new Promise((resolve) => setTimeout(resolve, 3000));
        feedback.status = "processed";
        await feedback.save();

        console.log(`Finished Analyzing : ${feedback.id}`);
    },
    {connection}
)

worker.on("completed", (job) =>{
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.log(`Job ${job.id} failed: ${err.message}`)
}
);

console.log("Feedback worker started - waaiting for jobs");