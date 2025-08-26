import { apiConnector } from "./apiConnecter";
import { toast } from "react-hot-toast";
import { paymentEndpoints } from "./apis";

const { CAPTURE_PAYMENT_API, VERIFY_PAYMENT_SIGNATURE_API } = paymentEndpoints;

function loadScript(src){
    return new Promise((resolve)=>{
        const script = document.createElement("script");
        script.src = src;
        script.onload = ()=>{
            resolve(true);
        };
        script.onerror = ()=>{
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

export const buyCouse = async (courseId,token,userDetails) => {
    const toastId = toast.loading("Redirecting to payment");
    try{

        // Load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if(!res){
            toast.error("Razorpay SDK failed to load");
            toast.dismiss(toastId);
            return;
        }

        const orderResponse = await apiConnector("POST", CAPTURE_PAYMENT_API, {courseId}, {
            Authorization: `Bearer ${token}`,
        });
        // Only runs for 2xx responses
        if(!orderResponse.data.success){
            toast.error(orderResponse.data.message);
            toast.dismiss(toastId);
            return;
        }
        const { amount, orderId, currency } = orderResponse.data;
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            currency: currency,
            amount: amount.toString(),
            order_id: orderId, 
            name: "CourseKart",
            description: "Thank you for purchasing the course",
            handler: async (response) => {
                await verifyPayment(response,courseId,token);
            },
            prefill:{
                name: userDetails.name,
                email: userDetails.email,
            },
            theme:{
                color: "#2563eb",
            },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Payment failed");
        });
        toast.dismiss(toastId);
    }catch(err){
        if (err.response && err.response.data && err.response.data.message) {
            toast.error(err.response.data.message);
        } else {
            toast.error(err.message);
        }
        toast.dismiss(toastId);
        return;
    }
};

export const verifyPayment = async (response, courseId, token) => {
    try{
        const toastId = toast.loading("Verifying payment, please wait...");
        const verifyResponse = await apiConnector("POST", VERIFY_PAYMENT_SIGNATURE_API, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId,
        },
        {
            Authorization: `Bearer ${token}`,
        });
        if(!verifyResponse.data.success){
            toast.error("Payment verification failed");
            toast.dismiss(toastId);
            return;
        }
        toast.success("Payment successful, you are now enrolled in the course");
        toast.dismiss(toastId);
    }catch(err){
        console.log(err);
        toast.error("Payment verification failed");
    }
};