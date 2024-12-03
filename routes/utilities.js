module.exports = {
  generateOtp: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
  generateTicketNumber: () => {
    // Generate a random 18-digit number
    let randomNumber = "";
    for (let i = 0; i < 18; i++) {
      randomNumber += Math.floor(Math.random() * 10); // Generate a random digit between 0-9
    }
    return randomNumber;
  },
};
