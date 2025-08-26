import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    usersEnrolled:[{
        type:mongoose.Types.ObjectId,
        ref:"User",
    }]
})
const Course = mongoose.model("Course",courseSchema);
export default Course;