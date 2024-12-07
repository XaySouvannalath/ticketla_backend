
const { checkCouponValid } = require("./db-execute/coupon");
const { generateOtp, generateTicketNumber } = require("./routes/utilities");

const jwt = require("jsonwebtoken")

const JWT_SECRET_KEY = "b1zg1tal";

async function validateCoupon() {
    const token = jwt.sign(
        { phone_number: "2079991199" }, // Payload (user's phone number)
        JWT_SECRET_KEY, // Secret key for signing
        {  } // Token expiration time
      );

      console.log(token)

}

// Call the function
validateCoupon();