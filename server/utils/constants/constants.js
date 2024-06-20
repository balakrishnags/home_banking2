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
            GET_FORGOT_PASSWORD_LIST: "/reqpasswordlist",
            GENERATE_QR: "/genqr",
            VERIFY_QR: "/verifyqr"
        },
        SSEVENTS: {
            GET_PASSWORD_EVENT: "/sse/admin",
            GET_PASSWORD_EVENT1: "/sse/admin1",
            UPDATE_PASSWORD_EVENT: "/sse/updatePasswordEvent",
            UPDATE_DETAILS_EVENT: "/sse/updateUserDetailsEvent",
            QR_SCAN_EVENT: "/sse/verifyQrscan"
        },
        USER: {
            CREATE_ROLE: "/createrole",
            UPDATE_ROLE: "/updaterole/:roleId",
            GET_ROLE: "/getrolelist",
            DELETE_ROLE: "/deleterole/:roleId",
            ADD_CREDIT_DEBIT: "/creditdebit/add",
            UPDATE_CREDIT_DEBIT: "/creditdebit/update/:dataId",
            GET_CREDIT_DEBIT_LIST: "/creditdebit/getlist/:type/:userId",
            DELETE_CREDIT_DEBIT: "/creditdebit/deletelist/:type/:dataId",
            ADD_PAYMENTDETAILS: "/payment/add",
            UPDATE_PAYMENTDETAILS: "/payment/update/:payId",
            GET_PAYMENTDETAILS: "/payment/getlist/:userId/:lendingId/:type",
            DELETE_PAYMENTDETAILS: "/payment/delete/:userId/:lendingId/:payId/:type",
            CHART_DATA: "/chartdata/:userId/:monthoryear/:date",
            GET_BALANCE: "/userbalance/:userId",
        },
        ENVLIST: {
            GET_ENVLIST: "/envlist/get",
            ADD_ENVLIST: "/envlist/add",
            UPDATE_ENVLIST: "/envlist/update/:envName",
            DELETE_ENVLIST: "/envlist/delete/:envName",
            ADD_ENV_DATA: "/envdata/add",
            GET_ENV_DATA: "/envdata/list/:envtype",
        }
    },
    DATA_TABLES: {
        USERS: "users",
        CREDIT_DATA: "creditdata",
        DEBIT_DATA: "debitdata",
        LENDING_DATA: "lendigdata",
        BORROW_DATA: "borrowingdata",
        PAYMENT_DATA: "paymenthistory",
        META_DATA: "metadata",
        USERLOG_DATA: "userlogdata",
        ROLE: "role",
    }
}