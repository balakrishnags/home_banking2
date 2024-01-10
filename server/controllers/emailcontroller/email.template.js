module.exports.EMAIL = {
    /**
     * signup subject and content
     */
    SIGNUP_SUBJECT: "User Registration",
    SIGNUP_TEMPLATE: (email, userPassword) => {
        return `<div>
                    <h5>Welcome to Home Banking Portal</h5>
                    <p>You are successfully registered to the home banking portal, Your Account credentials listed below,
                    <p className="mb-1">Email: ${email}</p>
                    <p>Password: ${userPassword}</p>
                    <p>Click the link to login: <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
                </div>`
    },

    // Reset password email subject and content
    RESET_SUBJECT: "Reset Password",
    RESET_TEMPLATE: (resetlink, token) => {
        return `Click the link to reset Password ${resetlink}?token=${token}`
    },

    // password changed email subject and content
    PASSWORD_CHANGE_SUBJECT: "Password Changed",
    PASSWORD_CHANGE_TEMPLATE: (userPassword) => {
        return `<div>
                    <p>As per your request, Password has been Changed and Provided below</p>
                    <p>Password: ${userPassword}</p>
                    <p>Click the link to login: <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
                </div>`
    }
}