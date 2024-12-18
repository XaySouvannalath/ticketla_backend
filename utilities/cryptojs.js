const CryptoJS = require("crypto-js");

const secret_key = "bizgital@123789";

module.exports = {
  encryptText: async (text) => {
    var ciphertext = CryptoJS.AES.encrypt(text, secret_key).toString();

    return ciphertext;
  },
  decryptText: async (ciphertext) => {
    var bytes = CryptoJS.AES.decrypt(ciphertext, secret_key);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;
  },
};
