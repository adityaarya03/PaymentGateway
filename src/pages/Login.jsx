import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnecter";
import { authEndpoints } from "../services/apis";
import { toast } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiConnector("POST", authEndpoints.LOGIN_API, formData);
      if (res.data.success) {
        toast.success("Login successful!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#010e22] to-purple-700">
      <form
        className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">Login to CourseKart</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 text-lg"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 text-lg"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-purple-700 transition font-semibold text-lg"
        >
          Login
        </button>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-900 cursor-pointer underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;