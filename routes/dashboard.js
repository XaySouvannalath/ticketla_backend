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
          total_active_users: totalUsers
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
          user_growth: result.map(row => ({
            date: row.date,
            new_users: row.new_users
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
      `;
      
      const result = await exec(query);

      if (result && result.length > 0) {
        res.status(200).json({
          success: true,
          coupon_type_counts: result.map(row => ({
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
        ORDER BY 
          claimed_coupons_count DESC
      `;
      
      const result = await exec(query);

      if (result && result.length > 0) {
        res.status(200).json({
          success: true,
          claimed_coupon_counts: result.map(row => ({
            coupon_type_code: row.coupon_type_code,
            claimed_coupons_count: row.claimed_coupons_count
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
        SELECT
          ct.type_code AS coupon_type_code,
          COUNT(c.coupon_number) AS unclaimed_coupons_count
        FROM
          coupon c
        INNER JOIN
          coupon_type ct ON c.coupon_type_code = ct.type_code
        LEFT JOIN
          coupon_usage cu ON c.coupon_number = cu.coupon_number
        WHERE
          c.record_status = 'O'
          AND ct.record_status = 'O'
          AND cu.id IS NULL
        GROUP BY
          ct.type_code
        ORDER BY
          unclaimed_coupons_count DESC
      `;
      
      const result = await exec(query);

      if (result && result.length > 0) {
        res.status(200).json({
          success: true,
          unclaimed_coupon_counts: result.map(row => ({
            coupon_type_code: row.coupon_type_code,
            unclaimed_coupons_count: row.unclaimed_coupons_count
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