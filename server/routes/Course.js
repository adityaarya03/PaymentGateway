import express from "express";
import upload from "../middlewares/multer.js";
import { createCourse, getAllCourses } from "../controllers/Course.js";

const router = express.Router();

router.post("/createCourse",upload.single("thumbnail"),createCourse);
router.get("/getAllCourses",getAllCourses);
export default router;
