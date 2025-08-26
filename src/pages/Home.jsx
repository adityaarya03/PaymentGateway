import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { courseEndpoints } from '../services/apis'
import { apiConnector } from '../services/apiConnecter'
import CourseCard from '../components/CourseCard'


function Home() {
    const {GET_ALL_COURSES_API} = courseEndpoints;
    const [courses, setCourses] = useState([]);
    const fetchCourses = async()=>{
        try{
            const response = await apiConnector("GET", GET_ALL_COURSES_API);
            if(!response.data.success)
            throw new Error("Could not fetch courses");
            console.log(response.data.courses);
            setCourses(response.data.courses);
        }catch(err){
            console.log(err);
        }
    };
    useEffect(()=>{
        fetchCourses();
    },[]);
    
  return (
    <div className=' bg-[#000b1c] min-h-screen'>
        <Navbar />
        {
                courses.length > 0 ? (
                    <div className=' h-screen w-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                        {
                            courses.map((course)=>(
                                <CourseCard key={course._id} course={course} />
                            ))
                        }
                    </div>
                ) : (
                    <div className=' text-white text-center mt-20'>
                        No courses available
                    </div>
                )
        }
    </div>
  )
}

export default Home