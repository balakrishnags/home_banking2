const authQueries = {
    // signup query
    signUpQuery: 'INSERT INTO users (userName,email,userRole,userDob,gender,userPhoneNumber,userPassword,userRegisteredDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?,?,?)',
    isUserPresent: 'SELECT * FROM users WHERE email = ? AND status=1',
    // metadata QUERY
    isMetaIdExist: 'SELECT metaId FROM metadata WHERE userId=?',
    // update metadata Query for forget password
    updateMetadataForgetQuery: 'UPDATE metadata SET isForgetPass=?,updatedDate=? WHERE userId=?',
    insertMetadataForgetQuery: "INSERT INTO metadata(userId,isForgetPass,createdDate,updatedDate,isChangePass) VALUES (?,?,?,?,?)",
    // getlist of forget password query
    forgetpasswordlistQuery: "SELECT m.userId,m.isForgetPass,m.isChangePass,m.updatedDate,u.userName,u.email,u.gender,u.userDob,u.userRole,u.userPhoneNumber FROM metadata m JOIN users u ON m.userId = u.userId WHERE (m.isForgetPass = 1 OR m.isChangePass = 1) AND u.status=1 ORDER BY m.updatedDate DESC",
    // change password sql
    changePasswordSql: `UPDATE users SET userPassword=?,updatedDate=? WHERE userId=?`,
    // resetpassword sql
    resetPassSql: 'UPDATE users SET userPassword=?,updatedDate=? WHERE userId=?',
    // get current password query
    currentpassQuery: "SELECT userPassword FROM users WHERE userId=? AND status=1",
    // isAdminQuery for login 
    isAdminTrue: 'SELECT * FROM users WHERE email = ? AND status=1 AND userRole=1',
    isUser: 'SELECT * FROM users WHERE email = ? AND status=1 AND userRole<>1',
    // store the userslogindata query
    userlogindataQuery: 'INSERT INTO userlogdata (userId, ipAddress, deviceType, browser,login) VALUES (?, ?, ?, ?, ?)',
    // check the metadata occurs Query
    isMetadataQuery: 'SELECT userId FROM metadata WHERE userId=?',
    // insert the meatadata query if metadata not present in db
    insertMetadataQuery: 'INSERT INTO metadata (userId,refreshToken,createdDate,updatedDate,isForgetPass,isChangePass) VALUES (?,?,?,?,?,?)',
    // update the meatadata query if metadata present in db
    updateMetaDataQuery: 'UPDATE metadata SET refreshToken=?,updatedDate=?,isForgetPass=?,isChangePass=? WHERE userId=?',

    // get list of users query
    usersQuery: 'SELECT userId,userName,email,userRole,DATE_FORMAT(userDob, "%Y-%m-%d") AS userDob,gender,userPhoneNumber,userRegisteredDate,updatedDate FROM users WHERE status=1 ORDER BY userId DESC',
    // get particular userdata Query
    particularUserQuery: 'SELECT userId,userName,email,userRole,DATE_FORMAT(userDob, "%Y-%m-%d") AS userDob,gender,userPhoneNumber,userRegisteredDate,updatedDate FROM users WHERE userId=? AND status=1',
    // delte User Query
    deleteUserQuery: 'UPDATE users SET status=0, updatedDate=? WHERE userId=?',
    // update user password by admin query
    userPassQuery: 'UPDATE users SET userPassword=?,updatedDate=? WHERE userId=?',
    // get email Query
    getEmailQuery: 'SELECT email FROM users WHERE userId=? AND status=1',
    // update metadata after user password update
    updateMetaAFterPassQuery: "UPDATE metadata SET isForgetPass=0,isChangePass=0,updatedDate=? WHERE userId=?",
    // update user details Query
    updateUserDetailsQuery: 'UPDATE users SET userName=?,userRole=?,userDob=?,gender=?,userPhoneNumber=?,updatedDate=? WHERE userId=?'
}

module.exports = authQueries