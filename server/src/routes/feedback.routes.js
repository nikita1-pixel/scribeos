const express = require("express");
const router = express.Router(); 
const { createFeedback, getFeedbacks, getFeedbackById, updateFeedback, deleteFeedback } = require("../controllers/feedback.controller");
const protect = require("../middleware/auth.middleware");

router.use(protect);

router.post("/", protect, createFeedback);
router.get("/", protect, getFeedbacks);
router.get("/:id", getFeedbackById);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

module.exports = router;