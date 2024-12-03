const { exec } = require("../services/database");

module.exports = {
  insertTicket: async ({ ticketCode, couponNumber }) => {
    let sql = "insert into ticket(ticket_code, coupon_code) values (?,?)";

    const params = [ticketCode, couponNumber];

    const result = await exec(sql, params);

    console.log(result);
    if (result) {
      return true;
    }
  },
  getTicketNumber: async ({ phoneNumber }) => {
    let sql = `  select ticket_code from ticket where coupon_code = (select coupon_number from coupon_usage where phone_number = ? and record_status = 'O')
    and record_status  = 'O' order by id desc limit 1`;

    try {
      let result = await exec(sql, [phoneNumber]);

      // Return the coupon type code if found
      if (result && result.length > 0) {
        return result[0].ticket_code;
      } else {
        // Return null if no matching coupon is found
        return null;
      }
    } catch (error) {
      console.error("Error in getting coupon type code:", error);
      throw new Error("Error fetching coupon type code");
    }
  },
  getTicketStatus: async ({ ticketNumber }) => {
    let sql =
      "select status from ticket where ticket_code = ? and record_status = 'O'";

    try {
      let result = await exec(sql, [ticketNumber]);

      // Return the coupon type code if found
      if (result && result.length > 0) {
        return result[0].status;
      } else {
        // Return null if no matching coupon is found
        return null;
      }
    } catch (error) {
      console.error("Error in getting coupon type code:", error);
      throw new Error("Error fetching coupon type code");
    }
  },
  checkTicketExist: async({phoneNumber})=>{
    let sql = `
     select count(*) as total from ticket where coupon_code  = (select coupon_code from coupon_usage where phone_number = ? and record_status = 'O')
    and record_status  = 'O'; 
    `

    let result = await exec(sql, [phoneNumber])
    return result[0].total
  }
};
