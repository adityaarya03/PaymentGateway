const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Auth APIs
export const authEndpoints = {
  SIGNUP_API: BASE_URL + "/user/signup",
  LOGIN_API: BASE_URL + "/user/login",
  LOGOUT_API: BASE_URL + "/user/logout",
  GET_PROFILE_API: BASE_URL + "/user/getProfile",
};
// Course APIs
export const courseEndpoints = {
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  GET_ALL_COURSES_API: BASE_URL + "/course/getAllCourses",
};
// Payment APIs
export const paymentEndpoints = {
  CAPTURE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  VERIFY_PAYMENT_SIGNATURE_API: BASE_URL + "/payment/verifySignature",
};
