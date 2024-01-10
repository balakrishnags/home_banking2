module.exports = {
    CONSTFIELDS: {
        GENDERFIELD: { MALE: "male", FEMALE: "female", OTHER: "other" }
    },
    API_PAYLOADS: {
        // authentication payloads
        AUTH_PAYLOAD: {
            SIGNIN: { EMAIL: "email", PASSWORD: "password", ISADMIN: "isAdmin" },
            SIGNUP: { NAME: "userName", EMAIL: "email", ROLE: "userRole", DOB: "userDob", GENDER: "gender", CONTACTNO: "userPhoneNumber", PASSWORD: "userPassword" },
            FORGETPASS: { EMAIL: "email" },
            RESETPASS: { NEWPASS: "newpassword", CONFIRMPASS: "confirmpassword" },
            ADMINRESETPASS: { CURRPASS: "currentpassword", NEWPASS: "newpassword", CONFIRMPASS: "confirmpassword" },
            UPDATEUSERDETAILS: { NAME: "userName", ROLE: "userRole", DOB: "userDob", GENDER: "gender", CONTACTNO: "userPhoneNumber", PASSWORD: "userPassword" }
        },
        // users payloads
        USERCRUD_PAYLOAD: {
            ADDCREDITDEBIT: { USERID: "userId", DESC: "description", DATE: "creditDate", AMOUNT: "creditAmount", TYPE: "type" },
            ADDPAYMENTDETAILS: { USERID: "userId", TYPE: "type", LENDID: "lendingId", DESC: "paymentDescription", DATE: "paymentDate", AMOUNT: "paymentAmount" }
        },
        // env payloads
        ENV_PAYLOAD: {
            ADDENVNAME: { ENVNAME: "name" },
            ADDENVDATA: { KEYNAME: "keyName", ACCESSKEY: "accessKey", TYPE: "type" }
        }
    },
    API_END_POINTS: {
        // auth modue endpoints
        AUTH: {
            SIGNUP: "/signup",
            SIGNIN: "/signin",
            FORGOT_PASSWORD: "/forgotpassword",
            RESET_PASSWORD: "/resetpassword/:token",
            CHANGE_PASSWORD: "/adminChangePassword/:userId",
            REFRESH_TOKEN: "/refreshtoken/:refreshtoken",
            USER_LIST: "/userlist",
            USER_DETAILS_BY_ID: "/detailsbyid/:userId",
            DELETE_USER: "/deletebyid/:userId",
            UPDATE_USER: "/updateDetailbyid/:userId",
            GET_FORGOT_PASSWORD_LIST: "/reqpasswordlist"
        },
        SSEVENTS: {
            GET_PASSWORD_EVENT: "/sse/admin",
            UPDATE_PASSWORD_EVENT: "/sse/updatePasswordEvent",
            UPDATE_DETAILS_EVENT: "/sse/updateUserDetailsEvent"
        }
    },
}