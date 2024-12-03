const { insertOtpLog } = require("../db-execute/otp_logs");
const { selectUser, insertUser, checkUserExist, setVerifyUser } = require("../db-execute/users");
const { exec } = require("../services/database");

const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "b1zg1tal";

module.exports = {
  getUser: async (req, res) => {
    result = await selectUser({});
    // (result);
    res.json(result);
  },

  // login

  // register

  verifyOtp: async (req, res) => {
    const { phoneNumber, otpCode } = req.body;

    // Check if phoneNumber and otpCode are provided
    if (!phoneNumber || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP code are required.",
      });
    }

    try {
      // Query to check if the OTP exists and matches
      const otpQuery = `
            SELECT * FROM otp_verifications 
            WHERE phone_number = ? 
            AND otp_code = ? 
            AND is_used = 0
            AND expires_at > CURRENT_TIMESTAMP
            LIMIT 1;
        `;
      const otpResult = await exec(otpQuery, [phoneNumber, otpCode]);

      console.log(otpResult);

      // If no matching OTP is found, return error
      if (otpResult.length === 0) {
        // Log OTP failure
        await insertOtpLog({ phoneNumber, action: "otp_failed" });

        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP.",
        });
      }

      // OTP is valid, mark it as used
      const updateOtpQuery = `
            UPDATE otp_verifications
            SET is_used = 1
            WHERE phone_number = ? AND otp_code = ?;
        `;
      await exec(updateOtpQuery, [phoneNumber, otpCode]);

      // Log OTP verification success
      await insertOtpLog({ phoneNumber, action: "otp_verified" });

      const token = jwt.sign(
        { phone_number: phoneNumber }, // Payload (user's phone number)
        JWT_SECRET_KEY, // Secret key for signing
        {  } // Token expiration time
      );

      // save user
      let isUserExist = await checkUserExist({phoneNumber})
      if(isUserExist == false){
        await insertUser({phoneNumber})
        await setVerifyUser({phoneNumber})
      }
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully.",
        token: token
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({
        success: false,
        message: "Server error occurred while verifying OTP.",
        error,
      });
    }
  },
};
