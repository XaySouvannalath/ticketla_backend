const { checkCouponUsage } = require("../db-execute/coupon_usage")



module.exports = {
    checkCouponUsage: async(req,res)=>{
        let phoneNumber = req.body.phoneNumber 


        let result = await checkCouponUsage({phoneNumber})
        res.json({
            success: true,
            have: result // true or false
        })
    }
}