const { exec } = require("../services/database")


module.exports = {
    selectUser: async({id, phone_number})=>{

        let result = []

        result = exec("select * from users")
        return result
    },
    checkUserExist: async({phoneNumber})=>{
        // exist return true
        // new user return false
        let sql = 'select * from users where phone_number = ?'

        let result = await exec(sql, [phoneNumber])
        console.log(result)

        if(result.length>0){
            return true
        }else{
            return false
        }
    },
    insertUser: async({
        phoneNumber
    })=>{
        let sql = "insert into users(phone_number) values(?)"

        let result = await exec(sql, [phoneNumber])
    },
    setVerifyUser: async({phoneNumber})=>{
        let sql = "update users set is_verified = 1 where phone_number = ?"
        let result = await exec(sql, [phoneNumber])
    }
}