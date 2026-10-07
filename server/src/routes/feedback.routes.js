const express = require("express");
const router = express.Router(); 
const { createFeedback, getFeedbacks, getFeedbackById, updateFeedback, deleteFeedback, askQuestion} = require("../controllers/feedback.controller");
const protect = require("../middleware/auth.middleware");
const blockDemo = require("../middleware/demo.middleware");
router.use(protect);

router.post("/", blockDemo, createFeedback);
router.post("/ask", askQuestion);
router.get("/", protect, getFeedbacks);
router.get("/:id", getFeedbackById);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

module.exports = router;