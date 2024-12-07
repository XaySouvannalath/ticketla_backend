const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const {getUser, verifyOtp } = require('../routes/users');
const { sendOTP, sendShirtMessage } = require("../routes/telbiz");
const { claimTicket, viewTicket } = require("../routes/ticket");
const { checkCouponUsage } = require("../routes/coupon_usage");
const { authMiddleware } = require("../middleware/jsonwebtoken");
const { getTotalActiveUsers, getUserGrowth, getCouponTypeCount, getClaimedCouponCount, getUnclaimedCouponCount } = require("../routes/dashboard");





// Public routes
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOtp);

// Protected routes
router.get("/users", authMiddleware, getUser);
router.post("/claimTicket", authMiddleware, claimTicket);
router.post("/viewTicket", authMiddleware, viewTicket);
router.post("/checkCouponUsage", authMiddleware, checkCouponUsage);
router.post("/sendShirtMessage", authMiddleware, sendShirtMessage);

// Dashboard routes
router.get("/dashboard/totalActiveUsers", authMiddleware, getTotalActiveUsers);
router.get("/dashboard/userGrowth", authMiddleware, getUserGrowth);
router.get("/dashboard/couponTypeCount", authMiddleware, getCouponTypeCount);
router.get("/dashboard/claimedCouponCount", authMiddleware, getClaimedCouponCount);
router.get("/dashboard/unclaimedCouponCount", authMiddleware, getUnclaimedCouponCount);


// support api:
router.post("/checkCouponUsage", authMiddleware, checkCouponUsage)
router.route("/sendShirtMessage", authMiddleware,sendShirtMessage)


module.exports = router;