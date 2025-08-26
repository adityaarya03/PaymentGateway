import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const isAuthenticated = async (req, res, next) => {
    try{
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ","");
        // Check if token is present
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Login first to access this resource"
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Token is invalid or expired"
            });
        }
        req.user = decoded;
        next();
    }catch(err){
        console.log("Auth middleware error",err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
};