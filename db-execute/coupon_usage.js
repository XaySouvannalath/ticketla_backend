const { exec } = require("../services/database");

module.exports = {
  insertCouponUsage: async ({ phoneNumber, couponNumber }) => {
    const insertQuery = `
        INSERT INTO coupon_usage (phone_number, coupon_number, record_status)
        VALUES (?, ?, 'O');
    `;

    try {
      // Execute the insert query
      await exec(insertQuery, [phoneNumber, couponNumber]);

      // Return true if the insert is successful
      return true;
    } catch (error) {
      // Log error to the console and return false if there is an issue
      console.error("Error inserting coupon usage:", error);
      return false;
    }
  },
  checkCouponUsage: async ({ phoneNumber }) => {
    const checkQuery = `
    SELECT COUNT(*) AS usage_count
    FROM coupon_usage
    WHERE phone_number = ?  AND record_status = 'O';
`;

    try {
      // Execute the query and get the result
      const result = await exec(checkQuery, [phoneNumber]);

      // If usage count is greater than 0, return true (coupon used)
      if (result[0].usage_count > 0) {
        return true;
      }

      // Otherwise, return false (coupon not used)
      return false;
    } catch (error) {
      console.error("Error checking coupon usage:", error);
      return false;
    }
  },
  checkCouponUsageByCouponNumber: async({couponNumber}) =>{
    const checkQuery = `
    SELECT COUNT(*) AS usage_count
    FROM coupon_usage
    WHERE coupon_number = ?  AND record_status = 'O';
`;

    try {
      // Execute the query and get the result
      const result = await exec(checkQuery, [couponNumber]);

      // If usage count is greater than 0, return true (coupon used)
      if (result[0].usage_count > 0) {
        return true;
      }

      // Otherwise, return false (coupon not used)
      return false;
    } catch (error) {
      console.error("Error checking coupon usage:", error);
      return false;
    }
  },

  getCountCoupon: async ({ couponTypeCode }) => {
    let sql = `SELECT IFNULL(COUNT(a.coupon_number), 0) AS total
                FROM coupon_usage a
                INNER JOIN coupon b ON b.coupon_number = a.coupon_number
                WHERE b.coupon_type_code =  ?`;

    let result = await exec(sql, [couponTypeCode]);

    return result[0].total
  },
};
