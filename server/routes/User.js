import express from "express";
const router = express.Router();
import {signup, login, logout, getProfile } from "../controllers/Auth.js"
import { isAuthenticated } from "../middlewares/auth.js";

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);
router.get("/getProfile",isAuthenticated,getProfile);

export default router;