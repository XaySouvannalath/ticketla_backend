const { exec } = require("../services/database");

module.exports = {
  getCouponTypeCode: async ({ couponCode }) => {
    // SQL query to get the coupon type code by coupon code
    let sql = `
         select coupon_type_code from coupon where coupon_number = ?
     `;

    try {
      // Execute the query with the coupon code parameter
      let result = await exec(sql, [couponCode]);

      // Return the coupon type code if found
      if (result && result.length > 0) {
        return result[0].coupon_type_code;
      } else {
        // Return null if no matching coupon is found
        return null;
      }
    } catch (error) {
      console.error("Error in getting coupon type code:", error);
      throw new Error("Error fetching coupon type code");
    }
  },
  getCouponType: async ({ couponCode }) => {
    let sql = `
          select type from coupon_type where type_code = (select coupon_type_code from coupon  where coupon_number = ?) ;
    `;
    try {
      let result = await exec(sql, [couponCode]);

      // Return the coupon type code if found
      if (result && result.length > 0) {
        return result[0].type;
      } else {
        // Return null if no matching coupon is found
        return null;
      }
    } catch (error) {
      console.error("Error in getting coupon type code:", error);
      throw new Error("Error fetching coupon type code");
    }
  },
  getCouponCodeByTicket: async ({ ticketCode }) => {
    let sql = `
    select coupon_code from ticket where ticket_code = ? and record_status = 'O'
`;
    try {
      let result = await exec(sql, [ticketCode]);

      // Return the coupon type code if found
      if (result && result.length > 0) {
        return result[0].coupon_code;
      } else {
        // Return null if no matching coupon is found
        return null;
      }
    } catch (error) {
      console.error("Error in getting coupon type code:", error);
      throw new Error("Error fetching coupon type code");
    }
  },
};
