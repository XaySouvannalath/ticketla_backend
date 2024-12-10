const { exec } = require("../services/database");

module.exports = {
  getTotalActiveUsers: async (req, res) => {
    try {
      const query = `
        SELECT COUNT(*) AS total_users 
        FROM users 
        WHERE record_status = 'O'
      `;
      
      const result = await exec(query);

      if (result && result.length > 0) {
        const totalUsers = result[0].total_users;
        res.status(200).json({
          success: true,
          data: totalUsers
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No data found"
        });
      }
    } catch (error) {
      console.error("Error fetching total active users:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred while fetching total active users.",
        error: error.message
      });
    }
  },
  getClaimedUser: async(req,res)=>{

  },
  getClaimationByUser: async(req,res)=>{
    try {
      const query = `
     select 'claimed' as users,count(phone_number) as total from users where phone_number    in (select phone_number from coupon_usage where record_status = 'O')
and record_status  = 'O' and is_verified  = 1
union
  select 'unclaim' as users, count(phone_number) as total from users where phone_number  not  in (select phone_number from coupon_usage where record_status = 'O')
and record_status  = 'O' and is_verified  = 1;
      `;
      
      const result = await exec(query);

      if (result && result.length > 0) {
        res.status(200).json({
          success: true,
          data: result
        });
      } else {
        res.status(404).json({
          success: false,
          message: "no data"
        });
      }
    } catch (error) {
      console.error("Error fetching user growth data:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred while fetching user growth data.",
        error: error.message
      });
    }

  },
  getUserGrowth: async (req, res) => {
    try {
      const query = `
        SELECT DATE(created_date) AS date, COUNT(*) AS new_users
        FROM users
        WHERE record_status = 'O'
        GROUP BY DATE(created_date)
        ORDER BY date
      `;
      
      const result = await exec(query);

      if (result && result.length > 0) {
        res.status(200).json({
          success: true,
          data: result.map(row => ({
            date: row.date,
            count: row.new_users
          }))
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No user growth data found"
        });
      }
    } catch (error) {
      console.error("Error fetching user growth data:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred while fetching user growth data.",
        error: error.message
      });
    }
  },
  getCouponTypeCount: async (req, res) => {
    try {
      const query = `
        SELECT 
          ct.type_code,
          COUNT(c.id) AS coupon_count
        FROM coupon c
        INNER JOIN coupon_type ct ON c.coupon_type_code = ct.type_code
        WHERE c.record_status = 'O' AND ct.record_status = 'O'
        GROUP BY ct.type_code
        order by ct.type_code desc
      `;
      
      const result = await exec(query);

      if (result && result.length > 0) {
        res.status(200).json({
          success: true,
          data: result.map(row => ({
            type_code: row.type_code,
            coupon_count: row.coupon_count
          }))
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No coupon type count data found"
        });
      }
    } catch (error) {
      console.error("Error fetching coupon type count data:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred while fetching coupon type count data.",
        error: error.message
      });
    }
  },
  getClaimedCouponCount: async (req, res) => {
    try {
      const query = `
        SELECT 
          ct.type_code AS coupon_type_code,
          COUNT(DISTINCT cu.coupon_number) AS claimed_coupons_count
        FROM 
          coupon_usage cu
        JOIN 
          coupon c ON cu.coupon_number = c.coupon_number
        JOIN 
          coupon_type ct ON c.coupon_type_code = ct.type_code
        WHERE 
          cu.record_status = 'O'
          AND c.record_status = 'O'
          AND ct.record_status = 'O'
        GROUP BY 
          ct.type_code
         order by ct.type_code desc

      `;
      
      const result = await exec(query);

      if (result && result.length > 0) {
        res.status(200).json({
          success: true,
          data: result.map(row => ({
            coupon_type_code: row.coupon_type_code,
            coupon_count: row.claimed_coupons_count
          }))
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No claimed coupon count data found"
        });
      }
    } catch (error) {
      console.error("Error fetching claimed coupon count data:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred while fetching claimed coupon count data.",
        error: error.message
      });
    }
  },
  getUnclaimedCouponCount: async (req, res) => {
    try {
      const query = `
    select ct.type_code as coupon_type_code , COUNT(c.coupon_number) as unclaimed_coupons_count from coupon c 
 inner join coupon_type ct on ct.type_code = c.coupon_type_code 
 where c.coupon_number not in (select coupon_number from coupon_usage  where record_status = 'O') 
 and c.record_status  = 'O'
 group by ct.type_code
 order by ct.type_code desc
      `;
      
      const result = await exec(query);

      if (result && result.length > 0) {
        res.status(200).json({
          success: true,
          data: result.map(row => ({
            coupon_type_code: row.coupon_type_code,
            coupon_count: row.unclaimed_coupons_count
          }))
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No unclaimed coupon count data found"
        });
      }
    } catch (error) {
      console.error("Error fetching unclaimed coupon count data:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred while fetching unclaimed coupon count data.",
        error: error.message
      });
    }
  }
};