const { dbGetTicketUsageByStaff } = require("../db-execute/ticket_usage")


module.exports = {
    getTicketUsageByStaff: async(req,res)=>{


        let {
            staffId
        } = req.body 

        let result = await dbGetTicketUsageByStaff({staffId})

        res.json({
            success: true,
            data: result
        })
    }
}