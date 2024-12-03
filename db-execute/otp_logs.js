const { exec } = require("../services/database");


module.exports = {
    /**
     * Inserts a new OTP log entry into the `otp_logs` table.
     * 
     * This function logs actions related to OTP operations, such as sending OTPs, 
     * verifying OTPs, or OTP failures. It records the phone number and the action performed.
     * 
     * @param {Object} params - The parameters for the OTP log.
     * @param {string} params.phoneNumber - The phone number associated with the OTP action.
     * @param {string} params.action - The action performed ('otp_sent', 'otp_verified', 'otp_failed').
     * 
     * @returns {Object} - An object containing the success status and any relevant messages.
     * @throws {Error} - Throws an error if the insert operation fails.
     */
    insertOtpLog: async ({ phoneNumber, action }) => {
        try {
            const query = `
                INSERT INTO otp_logs 
                (phone_number, action) 
                VALUES (?, ?);
            `;
            const params = [phoneNumber, action];
            
            const result = await exec(query, params);
            return {
                success: true,
                message: "OTP log inserted successfully",
                data: result
            };
        } catch (error) {
            console.error("Error inserting OTP log:", error);
            return {
                success: false,
                message: "Failed to insert OTP log",
                error
            };
        }
    }
};
