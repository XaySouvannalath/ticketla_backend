const {
  getCouponTypeCode,
  getCouponCodeByTicket,
  checkCouponValid,
} = require("../db-execute/coupon");
const {
  checkCouponUsage,
  insertCouponUsage,
  getCountCoupon,
  checkCouponUsageByCouponNumber,
} = require("../db-execute/coupon_usage");
const {
  insertTicket,
  getTicketNumber,
  getTicketStatus,
  checkTicketExist,
} = require("../db-execute/ticket");
const { sendShirtMessage } = require("./telbiz");
const { generateTicketNumber } = require("./utilities");

module.exports = {
  claimTicket: async (req, res) => {
    const { phoneNumber, couponNumber } = req.body;

    // Check if coupon has already been used by this phone number
    const hasUsedCoupon = await checkCouponUsage({ phoneNumber });
    const checkCouponUsageByCoupon = await checkCouponUsageByCouponNumber({
      couponNumber,
    });

    if (hasUsedCoupon) {
      // If the coupon has already been used by this phone number, send a response with a message
      return res.status(400).json({
        status: "error",
        message: "ເບີໂທນີ້ແລກຮັບຄູປອງແລ້ວ.",
      });
    }

    if (checkCouponUsageByCoupon) {
      // If the coupon has already been used, send a response with a message
      return res.status(400).json({
        status: "error",
        message: "ຄູປອງນີ້ຖືກນໍາໃຊ້ແລ້ວ.",
      });
    }

    //! check is this coupon is valid

    const isCouponValid = await checkCouponValid({
      coupon_number: couponNumber,
    });
    if (!isCouponValid) {
      return res.status(400).json({
        status: "error",
        message: "ຄູປອງນີ້ບໍ່ຖືກຕ້ອງ.",
      });
    }

    try {
      // Insert coupon usage data if not already used

      const success = await insertCouponUsage({ phoneNumber, couponNumber });

      if (success) {
        // 1. return ticket code
        let ticketCode = generateTicketNumber();

        let couponTypeCode = await getCouponTypeCode({
          couponCode: couponNumber,
        });
        console.log(couponTypeCode);

        let rs = await insertTicket({
          ticketCode: ticketCode,
          couponNumber: couponNumber,
        });
        console.log(rs);
        // 2. ຄົນທີ່ມາແລກບັດ VIP 200 ຄົນທຳອິດຈະໄດ້ເສື້ອ 2 ໂຕ
        //    ຄົນທີ່ມາແລກບັດ Normal 100 ຄົນທຳອິດຈະໄດ້ເສື້ອ 1 ໂຕ

        let ticketCount = await getCountCoupon({
          couponTypeCode: couponTypeCode,
        });
        if (couponTypeCode == "VIP") {
          console.log("VIP ticket");
          if (ticketCount <= 200) {
            console.log("win VIP shirt");
            await sendShirtMessage({ phoneNumber, couponTypeCode });
            return res.status(200).json({
              status: "success",
              success: true,
              message: "ແລກຮັບຄູປອງສໍາເລັດ.",
            });
          } else {
            console.log("no win VIP shirt");
            return res.status(200).json({
              status: "success",
              success: true,
              message: "ແລກຮັບຄູປອງສໍາເລັດ.",
            });
          }
        } else if (couponTypeCode == "NORMAL") {
          console.log("Normal Shirt");
          if (ticketCount <= 100) {
            console.log("Win Normal Shirt");
            console.log("Win Normal Shirt");
            await sendShirtMessage({ phoneNumber, couponTypeCode });
            return res.status(200).json({
              status: "success",
              success: true,
              message: "ແລກຮັບຄູປອງສໍາເລັດ.",
            });
          } else {
            console.log("no Win Normal Shirt");
            return res.status(200).json({
              status: "success",
              success: true,
              message: "ແລກຮັບຄູປອງສໍາເລັດ.",
            });
          }
        }

        // If insertion was successful, return a success response
      } else {
        // If insertion failed, send an error response
        return res.status(500).json({
          status: "error",
          message: "ແລກຮັບຄູປອງບໍ່ສໍາເລັດ, ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.",
        });
      }
    } catch (error) {
      console.error("Error in claimTicket API:", error);
      return res.status(500).json({
        status: "error",
        message: "ແລກຮັບຄູປອງບໍ່ສໍາເລັດ, ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.",
      });
    }
  },
  viewTicket: async (req, res) => {
    let { phoneNumber } = req.body;

    //check if this phone number has ticket
    let totalTicket = await checkTicketExist({ phoneNumber });
    if (totalTicket > 0) {
      let activity = {
        name: "Coke Studio (PONCHET, M.VIIZ)",
        phoneNumber: phoneNumber,
        ticketNumber: await getTicketNumber({ phoneNumber }),
        ticketType: "",
        price: 0,
        status: "",
        location: "ຫໍວັດທະນະທໍາ",
        day: "ສຸກ",
        date: "20 ທັນວາ 2024",
        time: "13:00-22:00",
      };

      let couponCode = await getCouponCodeByTicket({
        ticketCode: activity.ticketNumber,
      });
      activity.phoneNumber = phoneNumber;
      activity.ticketType = await getCouponTypeCode({ couponCode });
      activity.status = await getTicketStatus({
        ticketNumber: activity.ticketNumber,
      });

      res.json({
        success: true,
        ticket: activity,
      });
    } else {
      res.json({
        success: false,
        ticket: null,
      });
    }
  },
};
