import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/User.js";
import courseRoutes from "./routes/Course.js";
import paymentRoutes from "./routes/Payments.js";
import { cloudinaryConfig } from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
cloudinaryConfig();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173","https://payment-gateway-inky.vercel.app"],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true,
}));
const PORT = process.env.PORT || 5500;

// Connect to database
connectDB();

// User Routes
app.use("/api/v1/user",userRoutes);
// Course Routes
app.use("/api/v1/course",courseRoutes);
// Payment Routes
app.use("/api/v1/payment",paymentRoutes);
app.get("/",(req,res)=>{
    res.send("<h1>Payment Gateway Server is running</h1>");
});
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});