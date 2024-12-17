
const { checkCouponValid } = require("./db-execute/coupon");
const { generateOtp, generateTicketNumber } = require("./routes/utilities");

const jwt = require("jsonwebtoken")

const JWT_SECRET_KEY = "b1zg1tal";

const bcrypt = require("bcrypt");

const saltRounds = 10; // Number of salt rounds for bcrypt
const passwords = [];
for (let i = 1; i <= 10; i++) {
  passwords.push(`staff${i.toString().padStart(2, "0")}`); // Generates 'staff01' to 'staff10'
}

(async () => {
  // const hashedPasswords = [];

  // for (const password of passwords) {
  //   const hashedPassword = await bcrypt.hash(password, saltRounds);
  //   hashedPasswords.push({ username: password, password: hashedPassword });
  // }

  // console.log(JSON.stringify(hashedPasswords, null, 2));


  const saltRounds = 10;
  let result  = await bcrypt.hash("123", saltRounds)


  let pw = '$2b$10$3OvyMqiHioaD8vcqEPY3qeSAicXYIVD6Qhdxrz2iu5UKlR5YjfruC'
  let dbpw = '$2b$10$3OvyMqiHioaD8vcqEPY3qeSAicXYIVD6Qhdxrz2iu5UKlR5YjfruC'


  let rs = bcrypt.compare(pw)
  console.log(result)
})();
// Call the function
// validateCoupon();