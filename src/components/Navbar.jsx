import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnecter";
import { authEndpoints } from "../services/apis";

function Navbar() {
  const [menu, setMenu] = useState("hidden");
  const navigate = useNavigate();
  const handleChange = async () => {
    try {
      const res = await apiConnector("GET", authEndpoints.LOGOUT_API, null, {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      });
      if (!res.data.success) {
        toast.error(res.data.message || "Logout failed");
        return;
      }
      toast.success("Logged out successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };
  return (
    <div className=" bg-blue-950 text-white p-4 text-2xl font-bold">
      <div className=" flex justify-between items-center">
        <p onClick={() => {
            navigate("/");
        }} className=" cursor-pointer">
        CourseKart
        </p>
        <button
          onClick={() => {
            setMenu(menu === "hidden" ? "block" : "hidden");
          }}
        >
          <div className="rounded-full bg-white h-10 w-10 overflow-hidden flex items-center justify-center text-blue-950 font-bold">
            U
          </div>
        </button>
        <div
              className={`absolute bg-white text-black top-18 right-2 w-50 rounded-md overflow-hidden ${menu}`}
            >
              <div className=" text-xs flex flex-col">
                <button className=" " onClick={handleChange}>
                  <div className=" p-2 hover:bg-gray-200">Logout</div>
                </button>
                <button onClick={() => {
                    navigate("/dashboard");
                }}>
                    <div className=" p-2 hover:bg-gray-200">Dashboard</div>
                </button>
              </div>
            </div>
      </div>
    </div>
  );
}

export default Navbar;
