const { generateOtp, generateTicketNumber } = require("./routes/utilities");


let otp = generateOtp()
let ticketNumber = generateTicketNumber()

console.log(ticketNumber)