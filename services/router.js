const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const {getUser, verifyOtp } = require('../routes/users');
const { sendOTP, sendShirtMessage } = require("../routes/telbiz");
const { claimTicket, viewTicket, validateTicket, viewTicketByStaff } = require("../routes/ticket");
const { checkCouponUsage } = require("../routes/coupon_usage");
const { authMiddleware, staffMiddleWare } = require("../middleware/jsonwebtoken");
const { getTotalActiveUsers, getUserGrowth, getCouponTypeCount, getClaimedCouponCount, getUnclaimedCouponCount, getClaimationByUser } = require("../routes/dashboard");
const { staffLogin } = require("../routes/staff");
const { getTicketUsageByStaff } = require("../routes/ticket_usage");
const { claimShirt } = require("../routes/shirt-winner");





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
router.get("/dashboard/totalActiveUsers",  getTotalActiveUsers);
router.get("/dashboard/userGrowth",  getUserGrowth);
router.get("/dashboard/couponTypeCount",  getCouponTypeCount);
router.get("/dashboard/claimedCouponCount",  getClaimedCouponCount);
router.get("/dashboard/unclaimedCouponCount",  getUnclaimedCouponCount);
router.get("/dashboard/getClaimationByUser",  getClaimationByUser);
// router.get("/dashboard/totalActiveUsers", authMiddleware, getTotalActiveUsers);
// router.get("/dashboard/userGrowth", authMiddleware, getUserGrowth);
// router.get("/dashboard/couponTypeCount", authMiddleware, getCouponTypeCount);
// router.get("/dashboard/claimedCouponCount", authMiddleware, getClaimedCouponCount);
// router.get("/dashboard/unclaimedCouponCount", authMiddleware, getUnclaimedCouponCount);



// staff section
router.post("/staff/login", staffLogin)
router.post("/staff/viewTicketByStaff",staffMiddleWare, viewTicketByStaff)
router.post("/staff/validateTicket",staffMiddleWare, validateTicket)
router.post("/staff/getTicketUsageByStaff", staffMiddleWare,getTicketUsageByStaff)
router.post("/staff/claimShirt", staffMiddleWare,claimShirt)


// support api:
router.post("/checkCouponUsage", authMiddleware, checkCouponUsage)
router.route("/sendShirtMessage", authMiddleware,sendShirtMessage)


module.exports = router;