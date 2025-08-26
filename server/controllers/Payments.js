import { mongo } from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { mailSender } from "../utils/mailSender.js";
import { razorpayInstance } from "../config/razorpay.js";
import mongoose from "mongoose";
import crypto from "crypto";

export const capturePayment = async (req, res)=>{
    try{
        const {courseId} = req.body;
        const userId = req.user.id;

        // Validate the inputs
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:"Please provide all the details"
            });
        }
        // Check if the course exists
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            });
        }
        // Check if the user is already enrolled in the course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.usersEnrolled.some(id => id.equals(uid))) {
            return res.status(400).json({
                success: false,
                message: "User already enrolled in the course"
            });
        }
        const amount = course.price;
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Math.random() * 1000}`,
        };
        const paymentResponse = await razorpayInstance.orders.create(options);
        if(!paymentResponse){
            return res.status(500).json({
                success:false,
                message:"Could not initiate payment"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Payment initiated",
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Payment failed"
        });
    }
};

export const verifyPaymentSignature = async (req, res)=>{
    try{
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId} = req.body;
        const userId = req.user.id;

        // Validate the inputs
        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId){
            return res.status(400).json({
                success:false,
                message:"Please provide all the details"
            });
        }

        // Course Update function to add user to the course
        const enrollUser = async (courseId, userId) => {
            const course = await Course.findById(courseId);
            const user = await User.findById(userId);
            if(!course || !user){
                throw new Error("Course or user not found");
            }
            course.usersEnrolled.push(userId);
            user.courses.push(courseId);
            await course.save();
            await user.save();

            // Send confirmation email
            const emailResponse = await mailSender(
                user.email,
                "Course Enrollment Successful",
                `<h1>Congratulations, you have been enrolled in the course ${course.title} successfully</h1>
                <p>Happy Learning!</p>`
            );
            console.log("Email sent successfully", emailResponse);
            return res.status(200).json({
                success:true,
                message:"Payment successful, User enrolled in the course"
            });
        };

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");
        if(generated_signature == razorpay_signature){
            await enrollUser(courseId, userId);
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}