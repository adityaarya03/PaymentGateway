import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Course from "../models/Course.js";
const JWT_SECRET = process.env.JWT_SECRET;



export const signup = async (req,res)=>{
    try{
        // Fetch user data from req body
        const {name,email,password} = req.body;

        // Validation 
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            });
        }

        // Check if user already exists
        const existingUser = await User.find({email});
        if(existingUser.length>0){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        // Create a new user
        const user = new User({
            name,
            email,
            password:hashedPassword,
        });
        await user.save();
        return res.status(201).json({
            success:true,
            message:"User registered successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered"
        });
    }
};

export const login = async (req,res)=>{
    try{
        // Get user data from req body
        const {email,password} = req.body;
        // Validation
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            });
        }
        // Check if user exists
        const user = await User.findOne({email}).populate("courses");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            });
        }
        // Compare the password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            });
        }

        // Create a JWT token for the user 
        const token = jwt.sign(
            {
                email:user.email,
                id:user._id,
            },
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );

        // Save the token in the user database
        user.token = token;
        await user.save();
        user.password = undefined;

        // Set the token in the cookie
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true,
        }
        return res.cookie('token',token,options).status(200).json({
            success:true,
            message:"User logged in successfully",
            user,
            token,
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be logged in"
        });
    }
};

export const logout = async (req,res)=>{
    try{
        res.clearCookie("token");
        return res.status(200).json({
            success:true,
            message:"User logged out successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Could not log out user"
        });
    }
};
export const getProfile = async (req,res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).populate("courses");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        user.password = undefined;
        return res.status(200).json({
            success:true,
            user,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Could not fetch user profile"
        });
    }
};