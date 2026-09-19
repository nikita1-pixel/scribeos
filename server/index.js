require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db"); 
const authRoutes = require("./src/routes/auth.routes");
const feedbackRoutes = require("./src/routes/feedback.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/", (req, res) =>{
    res.json({message: "Scribeos Server is running!"});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});