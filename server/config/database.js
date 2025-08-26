import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async()=>{
    try{
        const res = await mongoose.connect(process.env.MONGO_URL);
        if(!res){
            console.log("DB connection failed");
            process.exit(1);
        }
        console.log("DB connected successfully");
    }catch(err){
        console.log("Error in DB connection",err);
        process.exit(1);
    }
};
export default connectDB;