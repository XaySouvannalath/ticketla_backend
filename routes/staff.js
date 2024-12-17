const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // For generating JWT
const { exec } = require("../services/database");

const JWT_SECRET = "your-secret-key"; // Replace with a strong secret key
const JWT_EXPIRATION = "1h"; // Token expiration time (adjust as needed)

module.exports = {
  staffLogin: async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({ message: "ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ." });
    }

    try {
      // Query to fetch the user by username
      const query = "SELECT * FROM staff_users WHERE username = ?";
      const results = await exec(query, [username]);
      console.log(results)

      if (results.length === 0) {
        return res.status(401).json({ message: "ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ." });
      }

      const user = results[0]; // Assuming the query returns an array of users

      // Compare the provided password with the hashed password in the database
      console.log(password)
      console.log(user.password)
      const isPasswordValid = await bcrypt.compare(password, user.password);

      let validd = password == user.password
      
      console.log("compare result", isPasswordValid)
      console.log("compare result 2", validd)
      if (!isPasswordValid) {
        return res.status(401).json({ message: "ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ." });
      }

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          record_status: user.record_status, // Include any other necessary user info
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      // Return success response with token
      return res.status(200).json({
        message: "ເຂົ້າສູລະບົບສໍາເລັດ!",
        token: token,
        user: {
          id: user.id,
          username: user.username,
          created_date: user.created_date,
          last_modified_date: user.last_modified_date,
          record_status: user.record_status,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "ມີຂໍ້ຜິດພາດໃນຂະນະທີ່ດໍາເນີນການຂໍ້ມູນ." });
    }
  },
};
