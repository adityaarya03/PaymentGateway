import nodemailer from "nodemailer";

export const mailSender = async( email, title, body)=>{
    try{
        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port: 587,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        });
        const info = await transporter.sendMail({
            from:`CourseBuy<${process.env.MAIL_USER}>`,
            to:email,
            subject:title,
            html:body,
        })
        console.log(info);
        return info;
    }catch(err){
        console.log("Error in mail sender",err);
        return err;
    }   
};
