var moment = require("moment");
const ERROR_MESSAGES = require("./constants/messages");

// timestamp
const presenttimestamp = moment().format()

// encryptionkey
const encryptionKey = 'homebankingEncryptionKey';
// Encryption function
const encryptData = (data) => {
    let encryptedData = '';
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length);
        encryptedData += String.fromCharCode(charCode);
    }
    return encryptedData;
}
// Decryption function
const decryptData = (data) => {
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

const convertToYearFormat = (date) => {
    return moment(new Date(date)).format('YYYY-MM-DD')
}

const serverErrorMsg = (res) => {
    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
}

module.exports = { presenttimestamp, encryptData, returnData, decryptData, convertToYearFormat, serverErrorMsg }