
const { checkCouponValid } = require("./db-execute/coupon");
const { generateOtp, generateTicketNumber } = require("./routes/utilities");




async function validateCoupon() {
    try {
        const couponNumber = '29882318';
        const result = await checkCouponValid({ coupon_number: couponNumber });

        console.log("Coupon Validation Result:", result);
    } catch (error) {
        console.error("Error validating coupon:", error);
    }
}

// Call the function
validateCoupon();