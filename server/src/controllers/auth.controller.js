const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (UserId) =>{
    return jwt.sign({ id : UserId }, process.env.JWT_SECRET, {expiresIn:"30d"});
}

const registerUser = async (req, res) =>{
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const user = await User.create({name, email, password});
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id) 
        });
    } catch(error){
        console.error("REGISTER ERROR:", error); 
        res.status(500).json({message: error.message});
    };
};

const loginUser = async (req, res) =>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message:"User does not exist"});
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id) 
        });
    } catch(error){
        res.status(500).json({message: error.message});
    
    };
};

const getMe = async(req, res) =>{
    res.status(200).json(req.user);
}

module.exports = {registerUser, loginUser, getMe};