const { exec } = require("../services/database");

module.exports = {
  insertTicketUsage: async ({ ticket_number, verified_by }) => {
    const query = `
        INSERT INTO ticket_usage (ticket_number, verified_by)
        VALUES (?, ?)
      `;

    try {
      // Execute the query with the provided ticket_number and verified_by
      const result = await exec(query, [ticket_number, verified_by]);

      // If the insert is successful, send a success response
      if (result.affectedRows > 0) {
        return true;
      } else {
        // If the insertion fails, send an error message
        return false;
      }
    } catch (error) {
      console.error("ຄວາມຜິດພາດ:", error);
      return false;
    }
  },
  dbGetTicketUsageByStaff: async({
    staffId
  }) =>{
    let sql = `
      select 
  tu.id,
  tu.ticket_number as ticket_code,
  tu.verified_by ,
  tu.created_date,
  t.status,
  ( select phone_number from coupon_usage where coupon_number = (
  select coupon_code from ticket where ticket_code = tu.ticket_number and record_status = 'O'
  )
  and record_status = 'O'
  ) as phone_number,
  ct.type
   
  
  
  from ticket_usage tu  
  
  inner join ticket t on t.ticket_code = tu.ticket_number
  
  inner join coupon_usage cu on cu.coupon_number = t.coupon_code
  inner join coupon c on c.coupon_number = cu.coupon_number
  inner join coupon_type ct on ct.type_code = c.coupon_type_code
  
  where t.record_status = 'O' and tu.record_status = 'O'
  and tu.verified_by = ?
  
    `

    let result = await exec(sql, [staffId])
    return result
  }
};
