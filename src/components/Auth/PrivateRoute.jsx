import React, { useEffect } from "react";
import { authEndpoints } from "../../services/apis.js";
import { apiConnector } from "../../services/apiConnecter.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PrivateRoute({children}) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      return;
    }

    //verify token by making an API call
    const verifyToken = async () => {
        try{
            const {GET_PROFILE_API} = authEndpoints;
            const response = await apiConnector("GET",GET_PROFILE_API, null, {
                Authorization: `Bearer ${token}`,
            });
            if(!response.data.success)
            throw new Error("Token not valid");
            //token is valid
            // Set user details in local storage
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }catch(err){
            navigate("/login");
            console.log(err);
        }
    };
    verifyToken();
  }, [token]);
  return children;
}

export default PrivateRoute;
