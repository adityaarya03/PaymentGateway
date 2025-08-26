import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export const imageUploader = async (file,folder,height,quality) => {
    try{
        const options = {
            folder: folder || "default_folder",
            transformation: [
                { height: height || 500, crop: "scale" },
                { quality: quality || "auto" }
            ]
        };
        const result = await new Promise((resolve,reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
        return result;
    }catch(err){
        console.log(err);
        throw err;
    }
};

