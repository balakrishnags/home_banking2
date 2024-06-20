const { DATA_TABLES } = require("../../utils/constants/constants")

const authQueries = {
    // signup query
    signUpQuery: `INSERT INTO ${DATA_TABLES.USERS} (userName,email,userRole,userDob,gender,userPhoneNumber,userPassword,userRegisteredDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    isUserPresent: `SELECT * FROM ${DATA_TABLES.USERS} WHERE email = ? AND status=1`,
    getUserData: `SELECT * FROM ${DATA_TABLES.USERS} WHERE userId = ?`,
    // metadata QUERY
    isMetaIdExist: `SELECT metaId FROM ${DATA_TABLES.META_DATA} WHERE userId=?`,
    // update metadata Query for forget password
    updateMetadataForgetQuery: `UPDATE ${DATA_TABLES.META_DATA} SET isForgetPass=?,updatedDate=? WHERE userId=?`,
    insertMetadataForgetQuery: `INSERT INTO ${DATA_TABLES.META_DATA}(userId,isForgetPass,createdDate,updatedDate,isChangePass) VALUES (?,?,?,?,?)`,
    // getlist of forget password query
    forgetpasswordlistQuery: `SELECT m.userId,m.isForgetPass,m.isChangePass,m.updatedDate,u.userName,u.email,u.gender,u.userDob,u.userRole,u.userPhoneNumber FROM ${DATA_TABLES.META_DATA} m JOIN ${DATA_TABLES.USERS} u ON m.userId = u.userId WHERE (m.isForgetPass = 1 OR m.isChangePass = 1) AND u.status=1 ORDER BY m.updatedDate DESC`,
    // change password sql
    changePasswordSql: `UPDATE ${DATA_TABLES.USERS} SET userPassword=?,updatedDate=? WHERE userId=?`,
    // resetpassword sql
    resetPassSql: `UPDATE ${DATA_TABLES.USERS} SET userPassword=?,updatedDate=? WHERE userId=?`,
    // get current password query
    currentpassQuery: `SELECT userPassword FROM ${DATA_TABLES.USERS} WHERE userId=? AND status=1`,
    // isAdminQuery for login 
    isAdminTrue: `SELECT * FROM ${DATA_TABLES.USERS} WHERE email = ? AND status=1 AND userRole=1`,
    isUser: `SELECT * FROM ${DATA_TABLES.USERS} WHERE email = ? AND status=1 AND userRole<>1`,
    // store the userslogindata query
    userlogindataQuery: `INSERT INTO ${DATA_TABLES.USERLOG_DATA} (userId, ipAddress, deviceType, browser,login) VALUES (?, ?, ?, ?, ?)`,
    // check the metadata occurs Query
    isMetadataQuery: `SELECT userId FROM ${DATA_TABLES.META_DATA} WHERE userId=?`,
    // insert the meatadata query if ${DATA_TABLES.META_DATA} not present in db
    insertMetadataQuery: `INSERT INTO ${DATA_TABLES.META_DATA} (userId,refreshToken,createdDate,updatedDate,isForgetPass,isChangePass) VALUES (?,?,?,?,?,?)`,
    // update the meatadata query if metadata present in db
    updateMetaDataQuery: `UPDATE ${DATA_TABLES.META_DATA} SET refreshToken=?,updatedDate=?,isForgetPass=?,isChangePass=? WHERE userId=?`,

    // get list of users query
    usersQuery: `SELECT userId,userName,email,userRole,DATE_FORMAT(userDob, "%Y-%m-%d") AS userDob,gender,userPhoneNumber,userRegisteredDate,updatedDate FROM ${DATA_TABLES.USERS} WHERE status=1 ORDER BY userId DESC`,
    // get particular userdata Query
    particularUserQuery: `SELECT userId,userName,email,userRole,DATE_FORMAT(userDob, "%Y-%m-%d") AS userDob,gender,userPhoneNumber,userRegisteredDate,updatedDate FROM ${DATA_TABLES.USERS} WHERE userId=? AND status=1`,
    // delte User Query
    deleteUserQuery: `UPDATE ${DATA_TABLES.USERS} SET status=0, updatedDate=? WHERE userId=?`,
    // update user password by admin query
    userPassQuery: `UPDATE ${DATA_TABLES.USERS} SET userPassword=?,updatedDate=? WHERE userId=?`,
    // get email Query
    getEmailQuery: `SELECT email FROM ${DATA_TABLES.USERS} WHERE userId=? AND status=1`,
    // update metadata after user password update
    updateMetaAFterPassQuery: `UPDATE ${DATA_TABLES.META_DATA} SET isForgetPass=0,isChangePass=0,updatedDate=? WHERE userId=?`,
    // update user details Query
    updateUserDetailsQuery: `UPDATE ${DATA_TABLES.USERS} SET userName=?,userRole=?,userDob=?,gender=?,userPhoneNumber=?,updatedDate=? WHERE userId=?`
}

module.exports = authQueries