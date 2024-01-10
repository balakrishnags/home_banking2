const ERROR_MESSAGES = Object.freeze({
    SUCCESS: {
        LOGIN: "User Loggedin SuccessFully",
        DATADDED: "data added",
        DATAUPDATED: "data updated",
        DATAFOUND: "data found",
        DATADELETED: "data deleted",
        PAYMENTDONE: "Payment already made/Completed",
        PAYMENTDETAILDEL: "Payment Detail deleted",
        USERREGISTERED: "User registered successfully, Account Credentials sent to the user through Email",
        FORGETTOKENGENERATED: "Reset password token sent to your Email, please check your Email",
        FORGETPASSWORDNOTIFY: "When the password is changed, you will be notified by email",
        USERPASSWORDCHANGED: 'Password changed, Email sent to the user email id',
        RESETPASS: "Password Resetted successfully",
        PASSWORDCHANGED: "Password Changed successfully",
        TOKENGENERATED: "New token generated"
    },
    ERROR: {
        LOGIN: "sign-in failed",
        SERVER: "Internal server error",
        USERNOTFOUND: "User not Found",
        USERNAMEPASSWORD: "Please enter valid email or password",
        INVALIDPASSWORD: "Invalid Password",
        TYPEUNDEFINED: "type is not defined",
        TYPEREQUIRED: "type required",
        NODATAFOUND: "No data found",
        ENTERVALIDID: "Enter Valid data Id",
        ROLENAMEEXISTS: "Role name Exists",
        ROLENAMEREQUIRED: "Role name Required",
        UNAUTHORIZED: "Unauthorized",
        TOKENEXPIRED: "Token expired",
        // autherrors
        GENDERERROR: "Gendre should be male or female or Other",
        VALIDPHONE: "Enter valid Phone Number",
        EMAILEXISTS: "email already exists",
        MAILSENTERROR: "User registerd, Email not sent, mail sending error",
        RESETPASSMAILSENTERROR: "Email not sent, mail sending error",
        VALIDEMAIL: "Please enter valid email",
        NEWANDCONFIRM: "New password and Confirm password should be same",
        INVALIDCURRENTPASSWORD: "Old password is not valid",
        RESETTOKENEXPIRED: "Reset Token expired",
        INVALIDCURRENTPASS: "Invalid Current Password"
    }
})

module.exports = ERROR_MESSAGES