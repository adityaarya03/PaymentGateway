import { v2 as cloudinary } from 'cloudinary'

export const cloudinaryConfig = () => {
    try{
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });
        console.log("Cloudinary configured successfully");

    }catch(err){
        console.log("Cloudinary config error",err);
        process.exit(1);
    }

};