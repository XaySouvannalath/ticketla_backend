const { exec } = require("../services/database");



module.exports = {
    insertOtpVerification: async ({ phoneNumber, otpCode }) => {
        try {
            // const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes from now
            const expiresAt = new Date(Date.now() + (8 * 60 * 60 * 1000) + (3 * 60 * 1000)); // 8 hours and 3 minutes from now --> Laos Clock

            const query = `
                INSERT INTO otp_verifications 
                (phone_number, otp_code, expires_at, is_used, record_status) 
                VALUES (?, ?, ?, 0, 'O');
            `;
            const params = [phoneNumber, otpCode, expiresAt];
            
            const result = await exec(query, params);
            return {
                success: true,
                message: "OTP verification record inserted successfully",
                data: result
            };
        } catch (error) {
            console.error("Error inserting OTP verification:", error);
            return {
                success: false,
                message: "Failed to insert OTP verification record",
                error
            };
        }
    }
}