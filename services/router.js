const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const {getUser, verifyOtp } = require('../routes/users');
const { sendOTP, sendShirtMessage } = require("../routes/telbiz");
const { claimTicket, viewTicket } = require("../routes/ticket");
const { checkCouponUsage } = require("../routes/coupon_usage");





router.route("/users").get(getUser)


router.route("/sendOTP").post(sendOTP)
router.route("/verifyOTP").post(verifyOtp)
router.route("/claimTicket").post(claimTicket)
router.route("/viewTicket").post(viewTicket)


// support api:
router.route("/checkCouponUsage").post(checkCouponUsage)

router.route("/sendShirtMessage").post(sendShirtMessage)


module.exports = router;