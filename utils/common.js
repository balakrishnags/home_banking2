var moment = require("moment");

// timestamp
const presenttimestamp = moment().format()

// encryptionkey
const encryptionKey = 'homebankingEncryptionKey';
// Encryption function
const encryptData = (data, key) => {
    let encryptedData = '';
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
        encryptedData += String.fromCharCode(charCode);
    }
    return encryptedData;
}
// Decryption function
const decryptData = (data, key) => {
    let decryptedData = '';
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
        decryptedData += String.fromCharCode(charCode);
    }
    return decryptedData;
}


// return function with status code
const returnData = (res, status, message, data) => {
    let _data = data ? res.status(status).json({ status: status, message: message, data: data }) : res.status(status).json({ status: status, message: message })
    return _data
}

module.exports = { presenttimestamp, encryptData, returnData, decryptData }