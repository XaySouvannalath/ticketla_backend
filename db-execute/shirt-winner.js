const { exec } = require("../services/database");

module.exports = {
  insertShirtWinner: async ({ phone_number, num_of_shirt }) => {
    let sql = `
            INSERT INTO shirt_winner (?, ?, status)
        `;

    let result = await exec(sql, [phone_number, num_of_shirt]);

    return result;
  },

  dbClaimShirt: async ({ phone_number }) => {
    console.log(phone_number)
    try {
      const sql =
        "UPDATE shirt_winner SET status = 'claimed' WHERE phone_number = ?";
      const result = await exec(sql, [phone_number]);
      console.log(result)

      if (result.affectedRows > 0) {
        return {
          success: true,
          message: "Status updated to 'claimed' successfully.",
        };
      } else {
        return {
          success: false,
          message:
            "No rows were updated. Check if the phone number exists or is already claimed.",
        };
      }
    } catch (error) {
      console.error("Error updating status:", error);
      return {
        success: false,
        message: "An error occurred while updating the status.",
        error: error.message,
      };
    }
  },
};
