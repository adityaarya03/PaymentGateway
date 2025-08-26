import Course from "../models/Course.js";
import { imageUploader } from "../utils/imageUploader.js";

export const createCourse = async (req, res) => {
    try{
        const {title, description, price} = req.body;
        const thumbnail = req.file;
        if(!title || !description || !price || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            });
        }

        // Upload image to cloudinary
        const uploadResult = await imageUploader(thumbnail, "course_thumbnails", 500, "auto");
        const course = new Course({
            title,
            description,
            price,
            thumbnail:uploadResult.secure_url,
        });
        const createdCourse = await course.save();
        if(!createdCourse){
            return res.status(500).json({
                success:false,
                message:"Course cannot be created"
            });
        }
        return res.status(201).json({
            success:true,
            message:"Course created successfully",
            course:createdCourse,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Course cannot be created"
        });
    }
};

export const getAllCourses = async (req,res)=>{
    try{
        const courses = await Course.find({}).populate("usersEnrolled");
        return res.status(200).json({
            success:true,
            courses,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch courses"
        });
    }
}