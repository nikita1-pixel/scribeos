
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const { analyzeFeedback, embedText } = require("../services/ai.service");

const sampleFeedback = [
    { text: "The onboarding was the smoothest I've seen — I was up and running in five minutes.", source: "survey" },
    { text: "Delivery was lightning fast and the packaging was lovely.", source: "review" },
    { text: "Your support agent went above and beyond to fix my issue. Amazing service.", source: "email" },
    { text: "The new dashboard redesign is beautiful and so much easier to navigate.", source: "review" },
    { text: "Love the mobile app — it's fast and clean.", source: "review" },
    { text: "The checkout process is confusing and slow.", source: "survey" },
    { text: "Support never replied to my refund request, very frustrating.", source: "email" },
    { text: "The checkout page is painfully slow and keeps timing out.", source: "chat" },
    { text: "Your support team was rude and unhelpful when I called.", source: "chat" },
    { text: "The app crashed three times while I was trying to pay.", source: "review" },
    { text: "I was charged twice for the same order and no one will help me.", source: "email" },
    { text: "The product is fine, does what it says, nothing special.", source: "survey" },
    { text: "Pricing is okay but I wish there was a monthly plan option.", source: "other" },
    { text: "The interface is average, it took me a while to find the settings.", source: "survey" },
    { text: "Shipping was on time and the item was exactly as described.", source: "review" },
];

const seedDemo = async () => {
    await connectDB();

    let demo = await User.findOne({ isDemo: true });
    if (!demo) {
        demo = await User.create({
            name: "Demo User",
            email: "demo@scribeos.app",
            password: "demo123456",
            isDemo: true,
        });
        console.log("Created demo user:", demo.email);
    } else {
        console.log("Reusing demo user:", demo.email);
    }

    await Feedback.deleteMany({ createdby: demo._id });
    console.log("Cleared old demo feedback");

    for (const item of sampleFeedback) {
        try {
            const analysis = await analyzeFeedback(item.text);
            const embedding = await embedText(item.text);

            await Feedback.create({
                text: item.text,
                source: item.source,
                createdby: demo._id,
                status: "processed",
                sentiment: analysis.sentiment,
                tags: analysis.tags,
                summary: analysis.summary,
                embedding,
            });
            console.log(`  ✓ ${analysis.sentiment.padEnd(8)} ${item.text.slice(0, 42)}...`);
        } catch (err) {
            console.error(`  ✗ failed: "${item.text.slice(0, 30)}..." →`, err.message);
        }
    }

    console.log("Demo workspace seeded.");
    await mongoose.disconnect();
    process.exit(0);
};

seedDemo();