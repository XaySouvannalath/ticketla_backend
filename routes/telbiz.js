let Telbiz = require("telbiz");
const { generateOtp } = require("./utilities");
const { insertOtpVerification } = require("../db-execute/otp_verification");
const { insertOtpLog } = require("../db-execute/otp_logs");

const tb = new Telbiz(
  "17138648941205541",
  "5fe032cb-f169-486e-bd2e-f6263c9d60bf"
);

module.exports = {
  sendOTP: async (req, res) => {
    // param: phone_number
    let phoneNumber = req.body.phoneNumber;

    let otpCode = generateOtp();

    // insert this otp to database
    let result = await insertOtpVerification({ phoneNumber, otpCode });

    await insertOtpLog({ phoneNumber, action: "otp_sent" });
    // return otp code
    tb.SendSMSAsync(
      tb.SMSHeader.OTP,
      phoneNumber,
      `ທ່ານໄດ້ຮັບລະຫັດ: ${otpCode} ຈາກ COKE STUDIO`
    )
      .then((rs) => {
        // res.json(rs);

        if (rs.response.success == true) {
          res.json({
            success: true,
            message: "OTP has sent!",
          });
        } else {
          res.json({
            success: false,
            message: "Oops, OTP has failed to send!",
          });
        }
      })
      .catch((err) => {
        res.json({
          success: true,
          message: "OTP has sent!",
        });
      });
  },
  sendShirtMessage: async ({phoneNumber, couponTypeCode}) => {
    // console.log(phoneNumber, couponTypeCode);
    
    // ສຳລັບບັດ VIP: ຂໍສະເເດງຄວາມຍິນດີ ທ່ານໄດ້ຮັບເສື້ອຢືດ "ໂຄ້ກ" 2 ຜືນ ເອົາຂໍ້ຄວາມນີ້ໄປແລກຮັບເສື້ອໄດ້ທີ່ໜ້າງານ
    // ສຳລັບບັດ Normal: ຂໍສະເເດງຄວາມຍິນດີ ທ່ານໄດ້ຮັບເສື້ອຢືດ "ໂຄ້ກ" 1 ຜືນ ເອົາຂໍ້ຄວາມນີ້ໄປແລກຮັບເສື້ອໄດ້ທີ່ໜ້າງານ
    let message = "";
    if (couponTypeCode == "VIP") {
      message = "ຂໍສະເເດງຄວາມຍິນດີ ທ່ານໄດ້ຮັບເສື້ອຢືດ ໂຄ້ກ 2 ຜືນ ເອົາຂໍ້ຄວາມນີ້ໄປແລກຮັບເສື້ອໄດ້ທີ່ໜ້າງານ";
      await tb
        .SendSMSAsync(tb.SMSHeader.News, phoneNumber, message)
        .then((rs) => {
          console.log(rs);
        //    res.json(rs);
        })
        .catch((err) => {
        //    res.json(err);
          console.log(err);
        });
    } else if (couponTypeCode == "NORMAL") {
      message = "ຂໍສະເເດງຄວາມຍິນດີ ທ່ານໄດ້ຮັບເສື້ອຢືດ ໂຄ້ກ 1 ຜືນ ເອົາຂໍ້ຄວາມນີ້ໄປແລກຮັບເສື້ອໄດ້ທີ່ໜ້າງານ";
      await tb
        .SendSMSAsync(tb.SMSHeader.News, phoneNumber, message)
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
