const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    text : { type: String, required: true, trim: true },
    source :{ type: String, enum:["email", "review", "chat", "survey", "other"], default: "other" },
    createdby :{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status :{ type: String, enum:["pending", "processed", "failed"], default: "pending" },
},
{timestamps: true}
);

module.exports = mongoose.model("Feedback", feedbackSchema);
