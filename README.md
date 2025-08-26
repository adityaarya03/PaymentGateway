# PaymentGateway – Secure Razorpay Integration with React & Node.js

This project demonstrates how to securely implement the **Razorpay Payment Gateway** in a full-stack web application using **React (Vite)** for the frontend and **Node.js/Express** for the backend.

---

## Table of Contents

- [Overview](#overview)
- [How Razorpay Payment Gateway Works](#how-razorpay-payment-gateway-works)
- [Secure Implementation in This Project](#secure-implementation-in-this-project)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Payment Flow](#payment-flow)
- [Security Best Practices](#security-best-practices)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [References](#references)

---

## Overview

Razorpay is a popular payment gateway in India that allows businesses to accept, process, and disburse payments online. Integrating Razorpay securely involves both client-side and server-side logic to ensure payments are initiated, verified, and recorded safely.

---

## How Razorpay Payment Gateway Works

![Razorpay Payment Flow Diagram](https://razorpay.com/docs/build/browser/assets/images/payment-flow-pg.jpg)

1. **Order Creation:**  
   The backend creates a payment order using Razorpay's API, specifying the amount, currency, and receipt details.

2. **Checkout:**  
   The frontend loads Razorpay's checkout script and opens the payment modal with the order details.

3. **Payment:**  
   The user completes the payment using their preferred method (card, UPI, etc.).

4. **Signature Verification:**  
   After payment, Razorpay returns a payment ID, order ID, and signature. The backend verifies the signature to ensure the payment is authentic.

5. **Enrollment/Access:**  
   On successful verification, the user is granted access to the purchased resource (e.g., course enrollment).

---

## Secure Implementation in This Project

### Backend Setup

- **Order Creation:**  
  The backend exposes a `POST /api/v1/payment/capturePayment` endpoint.  
  It checks if the user is already enrolled, then creates an order using Razorpay's Node.js SDK.

- **Signature Verification:**  
  The backend exposes a `POST /api/v1/payment/verifySignature` endpoint.  
  It uses Node.js's `crypto` module to securely verify the payment signature sent by Razorpay.

- **User & Course Models:**  
  Mongoose models track user enrollments and course purchases, preventing duplicate payments.

- **Authentication:**  
  All payment routes are protected by JWT-based authentication middleware.

### Frontend Setup

- **Order Request:**  
  The frontend calls the backend to create a payment order when the user initiates a purchase.

- **Checkout Integration:**  
  The Razorpay checkout script is loaded dynamically.  
  Payment details (amount, order ID, user info) are passed to the Razorpay modal.

- **Payment Handler:**  
  On successful payment, the handler sends the payment details to the backend for verification.

- **Feedback:**  
  The frontend uses toast notifications to inform the user of payment status.

### Payment Flow

1. **User clicks "Buy Course"**  
   → Frontend sends a request to backend to create an order.

2. **Backend validates & creates order**  
   → Returns order ID, amount, and currency.

3. **Frontend opens Razorpay modal**  
   → User completes payment.

4. **Razorpay returns payment details**  
   → Frontend sends these to backend for verification.

5. **Backend verifies signature**  
   → If valid, enrolls user in course and responds with success.

6. **Frontend shows success/failure notification**

---

## Security Best Practices

- **Never expose secret keys on the frontend.**  
  Razorpay key secret is stored in backend `.env` and used only server-side.

- **Verify payment signature on the backend.**  
  Prevents tampering and ensures payment authenticity.

- **Authenticate all payment-related endpoints.**  
  Only logged-in users can initiate and verify payments.

- **Prevent duplicate enrollments.**  
  Backend checks if user is already enrolled before creating a new order.

- **Use HTTPS in production.**  
  Ensures secure transmission of payment data.

---

## Project Structure

```
PaymentGateway/
├── server/
│   ├── controllers/        # Auth, Course, Payments logic
│   ├── models/             # User, Course schemas
│   ├── routes/             # API route definitions
│   ├── config/             # Razorpay, DB, Cloudinary configs
│   ├── middlewares/        # Auth, Multer, etc.
│   ├── utils/              # Helpers (image upload, mail)
│   ├── server.js           # Express app entry
│   └── .env                # Secrets & config
├── src/
│   ├── pages/              # React pages (Login, Signup, Dashboard)
│   ├── services/           # API connectors, payment logic
│   ├── components/         # Navbar, etc.
│   └── App.jsx             # Routing
└── README.md
```

---

## Environment Variables

**Backend (`server/.env`):**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Frontend (`.env`):**
```
VITE_APP_BASE_URL=http://localhost:5500/api/v1
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## Running the Project

1. **Clone the repository**

2. **Install dependencies**
   ```sh
   cd server
   npm install
   cd ../
   npm install
   ```

3. **Set environment variables**  
   Fill in `.env` files for both backend and frontend.

4. **Start backend**
   ```sh
   cd server
   npm run dev
   ```

5. **Start frontend**
   ```sh
   npm run dev
   ```

6. **Access the app**  
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## References

- [Razorpay Docs](https://razorpay.com/docs/payment-gateway/server-integration/nodejs/)
- [Razorpay Checkout Integration](https://razorpay.com/docs/payment-gateway/web-integration/standard/)
- [Mongoose Docs](https://mongoosejs.com/)
- [React Docs](https://react.dev/)

---

**This project ensures secure, robust payment handling using Razorpay, with best practices for authentication, verification, and user experience.**
