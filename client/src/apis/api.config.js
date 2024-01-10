// all urls should be define here  

import { ENVDATA } from "../Conflict/Conflct"

export const baseUrl = ENVDATA.baseUrl
export const envType = ENVDATA.environment

export const configUrl = {
    // employee module
    signup: "/auth/api/superadmin/register",
    login: "/signin",
    refreshToken: "/refreshtoken/",
    forgotpassword: "/forgotpassword",
    resetPassword: "/resetpassword/",
    requestforgot: "/requestforgotpassword/",

    //  users module
    getUsers: "/userlist",
    createuser: "/signup",
    deleteUser: "/deletebyid/",
    updateUser: "/updateDetailbyid/",
    getPasswordReq: "/reqpasswordlist",
    getDetailsById: "/detailsbyid/",
    updatePassword: "/adminChangePassword/",

    // creditdebit module
    getcreditdebit: "/creditdebit/getlist/",
    addcreditdebit: "/creditdebit/add",
    updateCreditDebit: "/creditdebit/update/",
    deleteCreditDebit: "/creditdebit/deletelist/",

    // paymentDetails
    getPaymentDetails: "/payment/getlist/",
    addPaymentDetail: "/payment/add",
    updatePaymentDetail: "/payment/update/",
    deletePaymentDetail: "/payment/delete/",

    //dashboard
    getChartData: "/chartdata/",
    getAvailableBalance: "/userbalance/",

    // envdata
    getEnvData: '/envdata/list/',
    addEnvData: "/envdata/add",
    getEnvlist: "/envlist/get",
    addEnvList: "/envlist/add",
    updateEnvList: "/envlist/update/",
    deleteEnvList: "/envlist/delete/"
}