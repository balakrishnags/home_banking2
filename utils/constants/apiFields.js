const AUTHFIELDS = {
    SIGNIN: { EMAIL: "email", PASSWORD: "password", ISADMIN: "isAdmin" },
    SIGNUP: { NAME: "userName", EMAIL: "email", ROLE: "userRole", DOB: "userDob", GENDER: "gender", CONTACTNO: "userPhoneNumber", PASSWORD: "userPassword" },
    FORGETPASS: { EMAIL: "email" },
    RESETPASS: { NEWPASS: "newpassword", CONFIRMPASS: "confirmpassword" },
    ADMINRESETPASS: { CURRPASS: "currentpassword", NEWPASS: "newpassword", CONFIRMPASS: "confirmpassword" },
    UPDATEUSERDETAILS: { NAME: "userName", ROLE: "userRole", DOB: "userDob", GENDER: "gender", CONTACTNO: "userPhoneNumber", PASSWORD: "userPassword" }
}

const USERCRUDFIELDS = {
    ADDCREDITDEBIT: { USERID: "userId", DESC: "description", DATE: "creditDate", AMOUNT: "creditAmount", TYPE: "type" },
    ADDPAYMENTDETAILS: { USERID: "userId", TYPE: "type", LENDID: "lendingId", DESC: "paymentDescription", DATE: "paymentDate", AMOUNT: "paymentAmount" }
}

module.exports = { AUTHFIELDS, USERCRUDFIELDS }