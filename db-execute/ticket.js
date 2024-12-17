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
  checkTicketExist: async ({ phoneNumber }) => {
    let sql = `
     select count(*) as total from ticket where coupon_code  = (select coupon_code from coupon_usage where phone_number = ? and record_status = 'O')
    and record_status  = 'O'; 
    `;

    let result = await exec(sql, [phoneNumber]);
    return result[0].total;
  },
  getTicketDetailsByTicketNumber: async ({ ticketNumber }) => {
    try {
      // Query to get ticket details by ticket code (ticket number)
      const result = await exec(
        `
        
           select 
   
   t.id,
   t.ticket_code,
   t.status,
   cu.phone_number,
   ct.type,
   t.record_status
   #,cu.record_status as cu_rst
   
   
   from ticket t
   inner join coupon_usage cu  on cu.coupon_number  = t.coupon_code 
   inner join coupon c on c.coupon_number  = cu.coupon_number 
   inner join coupon_type ct on ct.type_code = c.coupon_type_code 
   
   where t.record_status = 'O'  
   and cu.record_status = 'O'
   and t.ticket_code = ?;
        `, // Ensure we only get active records
        [ticketNumber]
      );

      console.log(result);
      // If no ticket is found, return null
      if (result.length === 0) {
        return null;
      }

      // Return the first matching ticket (in case of multiple records, which should not happen here)
      return result[0];
    } catch (error) {
      // Log the error and throw it for the caller to handle
      console.error("Error in getTicketDetailsByTicketNumber:", error);
      throw new Error("Error fetching ticket details: " + error.message);
    }
  },

  markTicketAsUsed: async({ticketNumber}) =>{
    try {
      // SQL query to update the ticket status to 'used'
      const query = `
        UPDATE ticket
        SET status = 'used'
        WHERE ticket_code = ? AND record_status = 'O'
      `;
  
      // Execute the query with the ticket code
      const result = await exec(query, [ticketNumber]);
  
      // Check if the ticket was updated
      if (result.affectedRows === 0) {
        throw new Error("Ticket not found or already used.");
      }
  
      // Return success message
      return { success: true, message: "Ticket marked as used successfully." };
    } catch (error) {
      // Log the error and throw it for the caller to handle
      console.error("Error in setTicketUsed:", error);
      throw new Error("Error marking ticket as used: " + error.message);
    }  
  }
};
