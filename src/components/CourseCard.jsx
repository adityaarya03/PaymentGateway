import React from 'react'
import toast from 'react-hot-toast';
import { buyCouse } from "../services/payment.js";

function CourseCard(props) {
    const {name,email} = localStorage.getItem("user");
    const {_id,price,title,description,thumbnail} = props.course;
  return (
    <div className=' w-[300px] h-[400px] p-4 text-white flex flex-col items-center justify-center gap-3 shadow-lg'>
        <img src={thumbnail} alt="" />
        <h1>{title}</h1>
        <p>{description}</p>
        <h2 className=''>Price - INR <span className='text-[#0fae49] font-bold'>{price}</span></h2>
        <button onClick={()=>{
            const token = localStorage.getItem("token");
            if(!token){
                toast.error("Please login to buy the course");
                return;
            }
            buyCouse(_id,token,{name,email});
        }} className=' py-2 px-4 rounded-2xl text-[1em] bg-[#038a34]'>Buy Now</button>
    </div>
  )
}

export default CourseCard