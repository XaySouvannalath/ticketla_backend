let Telbiz = require("telbiz");
const { generateOtp } = require("./utilities");
const { insertOtpVerification } = require("../db-execute/otp_verification");
const { insertOtpLog } = require("../db-execute/otp_logs");
const { insertShirtWinner } = require("../db-execute/shirt-winner");

const tb = new Telbiz(
  "17138648941205541",
  "5fe032cb-f169-486e-bd2e-f6263c9d60bf"
);

module.exports = {
  sendOTP: async (req, res) => {
    try {
      // param: phone_number
      let phoneNumber = req.body.phoneNumber;

      // Validate phone number
      // Validation checks
      if (!phoneNumber.startsWith("20")) {
        return res.json({
          success: false,
          message: "ເບີໂທຕ້ອງມີ 20 ຂຶ້ນໜ້າ.",
        });
      }

      if (!/[25789]/.test(phoneNumber[2])) {
        return res.json({
          success: false,
          message: "ເບີໂທຕ້ອງຂຶ້ນຕົ້ນດ້ວຍ 2, 7, 5, 8 ຫຼື 9 ຕາມເຄືອຂ່າຍເບີມືຖື.",
        });
      }

      if (phoneNumber.length !== 10) {
        return res.json({
          success: false,
          message: "ເບີໂທຕ້ອງມີຈຳນວນ 10 ຕົວເລກ.",
        });
      }

      let otpCode = generateOtp();

      // Insert this OTP into the database
      let result = await insertOtpVerification({ phoneNumber, otpCode });

      await insertOtpLog({ phoneNumber, action: "otp_sent" });

      // Send OTP via SMS
      tb.SendSMSAsync(
        tb.SMSHeader.OTP,
        phoneNumber,
        `ທ່ານໄດ້ຮັບລະຫັດ: ${otpCode} ຈາກ COKE STUDIO`
      )
        .then((rs) => {
          if (rs.response.success === true) {
            res.json({
              success: true,
              message: "OTP has been sent!",
            });
          } else {
            res.status(500).json({
              success: false,
              message: "Oops, OTP failed to send!",
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: "An error occurred while sending the OTP.",
            error: err.message,
          });
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  },
  sendShirtMessage: async ({ phoneNumber, couponTypeCode }) => {
    // console.log(phoneNumber, couponTypeCode);

    // ສຳລັບບັດ VIP: ຂໍສະເເດງຄວາມຍິນດີ ທ່ານໄດ້ຮັບເສື້ອຢືດ "ໂຄ້ກ" 2 ຜືນ ເອົາຂໍ້ຄວາມນີ້ໄປແລກຮັບເສື້ອໄດ້ທີ່ໜ້າງານ
    // ສຳລັບບັດ Normal: ຂໍສະເເດງຄວາມຍິນດີ ທ່ານໄດ້ຮັບເສື້ອຢືດ "ໂຄ້ກ" 1 ຜືນ ເອົາຂໍ້ຄວາມນີ້ໄປແລກຮັບເສື້ອໄດ້ທີ່ໜ້າງານ
    let message = "";
    if (couponTypeCode == "VIP") {

      await insertShirtWinner({
        phone_number: phoneNumber,
        num_of_shirt: 2
      })
      message =
        "ຂໍສະເເດງຄວາມຍິນດີ ທ່ານໄດ້ຮັບເສື້ອຢືດ ໂຄ້ກ 2 ຜືນ ເອົາຂໍ້ຄວາມນີ້ໄປແລກຮັບເສື້ອໄດ້ທີ່ໜ້າງານ";
      await tb
        .SendSMSAsync(tb.SMSHeader.OTP, phoneNumber, message)
        .then((rs) => {
          console.log(rs);
          //    res.json(rs);
        })
        .catch((err) => {
          //    res.json(err);
          console.log(err);
        });
    } else if (couponTypeCode == "NORMAL") {

      await insertShirtWinner({
        phone_number: phoneNumber,
        num_of_shirt: 1
      })
      message =
        "ຂໍສະເເດງຄວາມຍິນດີ ທ່ານໄດ້ຮັບເສື້ອຢືດ ໂຄ້ກ 1 ຜືນ ເອົາຂໍ້ຄວາມນີ້ໄປແລກຮັບເສື້ອໄດ້ທີ່ໜ້າງານ";
      await tb
        .SendSMSAsync(tb.SMSHeader.OTP, phoneNumber, message)
        .then((rs) => {
          console.log(rs);
          //    res.json(rs);
        })
        .catch((err) => {
          //    res.json(err);
          console.log(err);
        });
    }
  },
};
