
const { checkCouponValid } = require("./db-execute/coupon");
const { generateOtp, generateTicketNumber } = require("./routes/utilities");

const jwt = require("jsonwebtoken")

const JWT_SECRET_KEY = "b1zg1tal";

const bcrypt = require("bcrypt");
const { encryptText, decryptText } = require("./utilities/cryptojs");

const saltRounds = 10; // Number of salt rounds for bcrypt
const passwords = [];
for (let i = 1; i <= 10; i++) {
  passwords.push(`staff${i.toString().padStart(2, "0")}`); // Generates 'staff01' to 'staff10'
}

(async () => {
  let pw = "staff01@c0kE"


  let  epw = await encryptText(pw)

  let dpw =await  decryptText(epw)


let d1 = 'U2FsdGVkX19cE+EiBfM+gpihxL5U4Mqcmzk3/IfMG/E='


let d2 = 'U2FsdGVkX19cE+EiBfM+gpihxL5U4Mqcmzk3/IfMG/E='

let dpw1 =await  decryptText(d1)


console.log(dpw1)
console.log(await decryptText(d2))

})();
// Call the function
// validateCoupon();