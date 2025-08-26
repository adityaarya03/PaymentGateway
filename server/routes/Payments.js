import express from "express";
import { capturePayment, verifyPaymentSignature } from "../controllers/Payments.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/capturePayment",isAuthenticated,capturePayment);
router.post("/verifySignature",isAuthenticated,verifyPaymentSignature);
export default router;