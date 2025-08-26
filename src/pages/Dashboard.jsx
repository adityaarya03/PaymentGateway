import React, { useEffect, useState } from 'react'
import { apiConnector } from "../services/apiConnecter";
import { authEndpoints } from "../services/apis";
import { toast } from "react-hot-toast";
import Navbar from '../components/Navbar';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await apiConnector(
          "GET",
          authEndpoints.GET_PROFILE_API,
          null,
          { Authorization: `Bearer ${token}` }
        );
        if (res.data.success) {
            console.log(res.data);
          setProfile(res.data.user);
        } else {
          toast.error(res.data.message || "Failed to fetch profile");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-lg text-purple-700">Loading...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-lg text-red-600">Profile not found.</span>
      </div>
    );
  }

  return (
    <>
        <Navbar/>
    <div className="bg-[#000b1c] h-screen flex flex-col items-center pt-16">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Welcome, {profile.name}!</h2>
        <p className="mb-2 text-gray-700">
          <strong>Email:</strong> {profile.email}
        </p>
        <p className="mb-2 text-gray-700">
          <strong>Enrolled Courses:</strong>{" "}
          {profile.courses && profile.courses.length > 0
            ? profile.courses.map((course) => (
                <span key={course._id} className="inline-block text-purple-800 px-2 py-1 rounded mr-2 mb-1">
                  {course.title || course._id}
                </span>
              ))
            : "None"}
        </p>
      </div>
    </div>
    </>

  );
}

export default Dashboard