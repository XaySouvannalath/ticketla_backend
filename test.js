
const { checkCouponValid } = require("./db-execute/coupon");
const { generateOtp, generateTicketNumber } = require("./routes/utilities");

const jwt = require("jsonwebtoken")

const JWT_SECRET_KEY = "b1zg1tal";

const bcrypt = require("bcrypt");
const { encryptText, decryptText } = require("./utilities/cryptojs");
const { dbGetCloseEventTime, dbSetCloseEvent, dbSetOpenEvent } = require("./db-execute/setting");

const saltRounds = 10; // Number of salt rounds for bcrypt
const passwords = [];
for (let i = 1; i <= 10; i++) {
  passwords.push(`staff${i.toString().padStart(2, "0")}`); // Generates 'staff01' to 'staff10'
}

(async () => {

  let result = await dbSetCloseEvent()
  console.log(result)

})();
// Call the function
// validateCoupon();