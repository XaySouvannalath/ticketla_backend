const { dbClaimShirt } = require("../db-execute/shirt-winner")

module.exports = {
    claimShirt: async(req,res)=>{

        let phone_number = req.body.phoneNumber


        let result = await dbClaimShirt({phone_number})
        res.json(result)

    }
}