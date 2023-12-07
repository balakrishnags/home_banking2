const bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
const moment = require("moment")

const db = require("../database/database")
const RegEx = require("../utils/regEx");
const authQueries = require("../database/queries/authqueries");
const ERROR_MESSAGES = require("../utils/constants/messages");
const { presenttimestamp, encryptData, decryptData, returnData } = require("../utils/common");
const { ENVDATA } = require("../config/config");
const { usersendMail } = require("../Middleware/mailcredentials");
const CONSTFIELDS = require("../utils/constants/constants");

// get userlogData
function extractBrowserFromUserAgent(userAgent) {
    const regex = /(Chrome|Safari|Firefox|Edge|IE|Opera)/i;
    const match = userAgent.match(regex);
    return match ? match[0] : 'Unknown';
}

// signup
module.exports.signup = async (req, res) => {
    try {
        const { userName, email, userRole, userDob, gender, userPhoneNumber, userPassword } = req.body

        let genderGroup = Object.values(CONSTFIELDS.GENDERFIELD)
        if (!genderGroup.includes(gender.toLowerCase().trim())) {
            return returnData(res, 409, ERROR_MESSAGES.ERROR.GENDERERROR)
            // return res.status(409).json({ status: 409, Error: "" })
        }

        if (!(RegEx.phone__regEx.test(userPhoneNumber))) {
            return returnData(res, 409, ERROR_MESSAGES.ERROR.VALIDPHONE)
            // res.status(409).json({ status: 409, Error: "Enter valid Phone Number" })
        }

        let _userDob = moment(new Date(userDob)).format('YYYY-MM-DD')
        bcrypt.hash(userPassword, 9, async (err, hash) => {
            if (err) {
                // console.log("🚀 ~ file: authServices.js:43 ~ bcrypt.hash ~ err:", err)
                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                // return res.status(500).send({
                //     status: 500,
                //     error: "user Registration failed"
                // })
            } else {
                // const sql = 'INSERT INTO users (userName,email,userRole,userDob,gender,userPhoneNumber,userPassword,userRegisteredDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?,?,?)';

                const values = [userName, email, userRole, _userDob, gender, userPhoneNumber, hash, presenttimestamp, presenttimestamp, 1];

                db.query(authQueries.signUpQuery, values, async (err, result) => {
                    if (err && err.code === 'ER_DUP_ENTRY') {
                        return returnData(res, 400, ERROR_MESSAGES.ERROR.SERVER)
                        // return res.status(400).json({ status: 400, error: 'email already exists' });
                    }
                    if (err) {
                        // console.error('Error inserting user data:====>', err);
                        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                        // return res.status(500).json({ status: 500, error: 'User registration failed' });
                    }
                    // console.log('User registered successfully');
                    // return res.status(201).json({ status: 201, message: 'User registered successfully' });

                    let subject = "User Registration"
                    let html = `<div>
                                 <h5>Welcome to Home Banking Portal</h5>
                                 <p>You are successfully registered to the home banking portal, Your Account credentials listed below,
                                 <p className="mb-1">Email: ${email}</p>
                                 <p>Password: ${userPassword}</p>
                                 <p>Click the link to login: <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
                             </div>`

                    try {
                        const response = await usersendMail(email, subject, "", html)
                        // console.log("🚀 ~ file: authServices.js:206 ~ db.query ~ response:", response)
                        return returnData(res, 200, ERROR_MESSAGES.SUCCESS.USERREGISTERED)
                    } catch (err) {
                        // console.log("🚀 ~ file: authServices.js:208 ~ db.query ~ err:", err)
                        return returnData(res, 500, ERROR_MESSAGES.ERROR.MAILSENTERROR)
                    }


                    // const mailOptions = {
                    //     from: 'balakrishna.g@dollarbirdinc.com',
                    //     to: `${email}`,
                    //     subject: "User Registration",
                    //     html: `<div>
                    //             <h5>Welcome to Home Banking Portal</h5>
                    //             <p>You are successfully registered to the home banking portal, Your Account credentials listed below,
                    //             <p className="mb-1">Email: ${email}</p>
                    //             <p>Password: ${userPassword}</p>
                    //             <p>Click the link to login: <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
                    //         </div>`
                    // };

                    // resetPasswordMail.sendMail(mailOptions, (err, result) => {
                    //     if (err) {
                    //         // console.log("🚀 ~ file: userservice.js:730 ~ resetPasswordMail.sendMail ~ err:", err)
                    //         return res.status(500).json({ status: 500, error: 'Internal Server error' });
                    //     }

                    //     res.status(201).json({ satatus: 201, message: 'User registered successfully, Account Credentials sent to the user through Email' });
                    // });

                });
            }
        })
    } catch (err) {
        // console.log("🚀 ~ file: authServices.js:88 ~ module.exports.signup= ~ err:", err)
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(500).send({
        //     status: 500,
        //     error: "user Registration failed"
        // })
    }
}

// signin
module.exports.signin = async (req, res) => {
    try {
        const { email, password, isAdmin } = req.body;
        if (email && password) {
            const query = isAdmin ? authQueries.isAdminTrue
                : authQueries.isUser

            db.query(query, [email], (err, results) => {
                if (err) {
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                } else if (results.length === 0) {
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                } else {
                    const user = results[0];
                    bcrypt.compare(password, user.userPassword, (bcryptErr, isPasswordValid) => {
                        if (bcryptErr) {
                            return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                        } else if (!isPasswordValid) {
                            return returnData(res, 401, ERROR_MESSAGES.ERROR.INVALIDPASSWORD)
                        } else {
                            const userAgent = req.headers['user-agent'];
                            const device = userAgent.includes('Mobile') ? 'Mobile' : userAgent.includes('Tablet') ? 'Tablet' : 'Desktop';
                            const ip = req.connection.remoteAddress;

                            const browser = extractBrowserFromUserAgent(userAgent);
                            // const logQuery = authQueries.userlogindataQuery;
                            const logValues = [user.userId, ip, device, browser, presenttimestamp];

                            const userDataString = JSON.stringify({ email: user.email, roleId: user.userRole });

                            const encryptedData = encryptData(userDataString);

                            var token = jwt.sign(
                                { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.accesstokenexpiry });

                            var refereshtoken = jwt.sign(
                                { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.refreshtokenexpiry });

                            const isUserMetaDataSql = authQueries.isMetadataQuery
                            db.query(isUserMetaDataSql, [user.userId], async (err, result) => {
                                if (err) {
                                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                } else {
                                    const metaQuery = result.length > 0 ? authQueries.updateMetaDataQuery : authQueries.insertMetadataQuery
                                    const metaValues = result.length > 0 ? [refereshtoken, presenttimestamp, 0, 0, user.userId] : [user.userId, refereshtoken, presenttimestamp, presenttimestamp, 0, 0]
                                    db.query(`${authQueries.userlogindataQuery};${metaQuery}`, [...logValues, ...metaValues], (logErr) => {
                                        if (logErr) {
                                            return returnData(res, 500, ERROR_MESSAGES.ERROR.LOGIN)
                                        } else {
                                            let data = { token: token, refreshtoken: refereshtoken, email: user.email, roleId: user.userRole, userId: user.userId }
                                            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.LOGIN, data)
                                        }
                                    });
                                }
                            })
                        }
                    });
                }
            });
        } else {
            return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNAMEPASSWORD)
        }
    } catch (err) {
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
    }
}

// forgot password for the admins
module.exports.forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (email) {
            // const query = 'SELECT * FROM users WHERE email = ? AND status=1'

            db.query(authQueries.isUserPresent, [email], async (err, results) => {
                if (err) {
                    // console.error('Error querying the database:', err);
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: 'Internal server error' });
                }

                if (results.length === 0) {
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                    // return res.status(404).json({ status: 404, error: 'User not Found' });
                }

                const user = results[0];

                if (user.userRole == 1) {
                    let resetString = JSON.stringify({ email: user.email, userId: user.userId })
                    const encryptedData = encryptData(resetString);

                    var token = jwt.sign(
                        { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.forgottokenexpiry });


                    let subject = "Reset Password"
                    let text = `Click the link to reset Password ${ENVDATA.forgetPasswordlink}?token=${token}`

                    try {
                        const response = await usersendMail(email, subject, text)
                        // console.log("🚀 ~ file: authServices.js:206 ~ db.query ~ response:", response)
                        return returnData(res, 200, ERROR_MESSAGES.SUCCESS.FORGETTOKENGENERATED)
                    } catch (err) {
                        // console.log("🚀 ~ file: authServices.js:208 ~ db.query ~ err:", err)
                        return returnData(res, 500, ERROR_MESSAGES.ERROR.MAILSENTERROR)
                    }

                    // const mailOptions = {
                    //     from: 'balakrishna.g@dollarbirdinc.com',
                    //     to: `${email}`,
                    //     subject: "Reset Password",
                    //     text: `Click the link to reset Password http://localhost:3000/resetpassword?token=${token}`,
                    // };

                    // resetPasswordMail.sendMail(mailOptions, (err, result) => {
                    //     if (err) {
                    //         console.log("🚀 ~ file: authServices.js:215 ~ resetPasswordMail.sendMail ~ err:", err)
                    //         return res.status(500).json({ status: 500, error: 'Internal Server error' });
                    //     }

                    //     res.status(200).json({ satatus: 200, message: 'Email sent to Your email id, please check your Email' });
                    // });
                } else {
                    // const metaQuery = "SELECT metaId FROM metadata WHERE userId=?"
                    // const requestForgotSql = 'UPDATE metadata SET isForgetPass=?,updatedDate=? WHERE userId=?'
                    // const addSql = "INSERT INTO metadata(userId,isForgetPass,createdDate,updatedDate,isChangePass) VALUES (?,?,?,?,?)"

                    db.query(authQueries.isMetaIdExist, [user.userId], async (err, result2) => {
                        if (err) {
                            // console.error('Error querying the database:', err);
                            return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                            // return res.status(500).json({ status: 500, error: 'Internal server error' });
                        }
                        const sql = result2.length > 0 ? authQueries.updateMetadataForgetQuery : authQueries.insertMetadataForgetQuery
                        let requsetValues = result2.length > 0 ? [1, presenttimestamp, user.userId] : [user.userId, 1, presenttimestamp, presenttimestamp, 0]

                        db.query(sql, requsetValues, async (err, result) => {
                            if (err) {
                                // console.log("🚀 ~ file: userservice.js:468 ~ db.query ~ err:", err)
                                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                // return res.status(500).json({ status: 500, error: "Internal server error" })
                            }
                            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.FORGETPASSWORDNOTIFY, { roleId: user.userRole })
                            // return res.status(200).json({ status: 200, message: "When the password is changed, you will be notified by email.", data: { roleId: user.userRole } })
                        })
                    })
                }
            });
        } else {
            return returnData(res, 404, ERROR_MESSAGES.ERROR.VALIDEMAIL)
            // res.status(404).send({
            //     status: 404,
            //     message: "Please enter valid email"
            // })
        }
    } catch (err) {
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(500).json({ status: 500, error: 'Internal server Error' });
    }
}


//get the forget or change password requests
module.exports.getForgetPassRequests = async (req, res) => {
    try {
        const { result } = req.decodedToken
        if (result[0].userRole === 1) {
            // const sql2 = "SELECT m.userId,m.isForgetPass,m.isChangePass,m.updatedDate,u.userName,u.email,u.gender,u.userDob,u.userRole,u.userPhoneNumber FROM metadata m JOIN users u ON m.userId = u.userId WHERE (m.isForgetPass = 1 OR m.isChangePass = 1) AND u.status=1 ORDER BY m.updatedDate DESC"
            // const sql = "SELECT metaId,userId,createdDate,updatedDate,isForgetPass,isChangePass FROM metaData WHERE isForgetPass=1 OR isChangePass=1 ORDER BY updatedDate DESC"
            db.query(authQueries.forgetpasswordlistQuery, async (err, result) => {
                if (err) {
                    // console.log("🚀 ~ file: userservice.js:1349 ~ db.query ~ err:", err)
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: "Internal server error" })
                }
                if (result.length < 1) {
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.NODATAFOUND)
                    // return res.status(404).json({ status: 404, error: "No Data Found" })
                }
                // console.log("🚀 ~ file: userservice.js:508 ~ db.query ~ result:", result)

                return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, result)
                // return res.status(200).json({ status: 200, message: "Data Found", data: result })
            })

        } else {
            return returnData(res, 401, ERROR_MESSAGES.ERROR.UNAUTHORIZED)
            // return res.status(401).json({ status: 401, error: "Unauthorized" })
        }
    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:1347 ~ module.exports.getForgetPassRequests= ~ err:", err)
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(500).json({ status: 500, error: "Internal server error" })
    }
}


// Reset Password
module.exports.resetpassword = async (req, res) => {
    try {
        const { newpassword, confirmpassword } = req.body;

        const { token } = req.params
        if (newpassword == confirmpassword) {
            bcrypt.hash(newpassword, 9, async (err, hash) => {
                if (err) {
                    // console.log("🚀 ~ file: userservice.js:436 ~ bcrypt.hash ~ err:", err)
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, err: "Internal server error" })
                }
                let data = await jwt.verify(token, ENVDATA.jwtsecretkey);
                let isUser = JSON.parse(decryptData(data.encryptedData))

                // const passsql = `UPDATE users SET userPassword=?,updatedDate=? WHERE userId=?`;
                db.query(authQueries.resetPassSql, [hash, presenttimestamp, isUser.userId], (err, result) => {
                    if (err) {
                        // console.log("🚀 ~ file: userservice.js:105 ~ db.query ~ err:", err)
                        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                        // return res.status(500).json({ status: 500, error: 'Internal Server Error' });
                    }
                    return returnData(res, 200, ERROR_MESSAGES.SUCCESS.RESETPASS)
                    // return res.status(200).json({ status: 200, message: 'Password Resetted successfully' });
                });
            })
        } else {
            return returnData(res, 409, ERROR_MESSAGES.ERROR.NEWANDCONFIRM)
            // return res.status(409).json({
            //     status: 409,
            //     message: "New password and Confirm password should be same"
            // })
        }
    } catch (err) {
        return returnData(res, 401, ERROR_MESSAGES.ERROR.RESETTOKENEXPIRED)
        // return res.status(401).send({
        //     status: 401,
        //     error: "Reset Token expired"
        // })
    }
}

// change password for Admin
module.exports.adminChangePassword = async (req, res) => {
    try {
        const { currentpassword, newpassword, confirmpassword } = req.body;
        const { userId } = req.params
        const { result } = req.decodedToken

        if (result[0].userRole === 1) {
            if (newpassword !== confirmpassword) {
                return returnData(res, 400, ERROR_MESSAGES.ERROR.NEWANDCONFIRM)
                // return res.status(400).json({ status: 400, error: "New Password and Confirm Password Should be same" })
            }

            // const currentpassQuery = "SELECT userPassword FROM users WHERE userId=? AND status=1"

            db.query(authQueries.currentpassQuery, [userId], (err, result2) => {
                if (err) {
                    // console.log("🚀 ~ file: userservice.js:595 ~ db.query ~ err:", err)
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: "Server error" })
                }
                if (result.length < 1) {
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                    // return res.status(404).json({ status: 404, error: "User not Found" })
                }

                bcrypt.compare(currentpassword, result2[0].userPassword, (bcrypterr, isValid) => {
                    if (bcrypterr) {
                        // console.log("🚀 ~ file: userservice.js:603 ~ bcrypt.compare ~ bcrypterr:", bcrypterr)
                        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                        // return res.status(500).json({ status: 500, error: "Server error" })
                    }
                    if (!isValid) {
                        return returnData(res, 401, ERROR_MESSAGES.ERROR)
                        // return res.status(401).json({ status: 401, error: "Invalid Current Password" })
                    }
                    if (currentpassword === newpassword) {
                        return returnData(res, 409, ERROR_MESSAGES.ERROR.NEWANDCONFIRM)
                        // return res.status(400).json({ status: 400, error: "New Password and old Password cannot be same" })
                    }
                    // console.log("🚀 ~ file: userservice.js:602 ~ bcrypt.compare ~ result:", result)
                    bcrypt.hash(newpassword, 9, async (err, hash) => {
                        if (err) {
                            return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                            // return res.status(500).json({ status: 500, err: "Internal server error" })
                        }

                        // const passsql = `UPDATE users SET userPassword=?,updatedDate=? WHERE userId=?`;
                        db.query(authQueries.changePasswordSql, [hash, presenttimestamp, userId], (err, result) => {
                            if (err) {
                                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                // return res.status(500).json({ status: 500, error: 'Internal Server Error' });
                            }
                            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.PASSWORDCHANGED)
                            // return res.status(200).json({ status: 200, message: 'Password Changed successfully' });
                        });
                    })
                })
            })

        } else {
            return returnData(res, 401, ERROR_MESSAGES.ERROR.UNAUTHORIZED)
            // return res.status(401).json({
            //     status: 401,
            //     error: "Unanutorized"
            // })
        }

    } catch (err) {
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(401).json({
        //     status: 401,
        //     error: "Token expired"
        // })
    }
}

// refreshtoken
module.exports.refreshtoken = async (req, res) => {
    const { refreshtoken } = req.params
    try {
        let data = await jwt.verify(refreshtoken, ENVDATA.jwtsecretkey);
        let isToken = JSON.parse(decryptData(data.encryptedData))

        const encryptedData = encryptData(JSON.stringify(isToken));
        var token = jwt.sign(
            { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.accesstokenexpiry });

        return returnData(res, 201, ERROR_MESSAGES.SUCCESS.TOKENGENERATED, { token: token })
        // return res.status(201).json({
        //     status: 201,
        //     message: "new token generated",
        //     token: token
        // })
    } catch (err) {
        return returnData(res, 401, ERROR_MESSAGES.ERROR.TOKENEXPIRED)
        // return res.status(401).send({
        //     status: 401,
        //     error: "Token expired"
        // })
    }
}

// get users
module.exports.listUsers = async (req, res) => {
    try {
        const { result } = req.decodedToken
        let userrole = result[0].userRole
        // console.log("🚀 ~ file: userservice.js:586 ~ module.exports.listUsers= ~ _userrole:", userrole)
        if (userrole == "1") {
            // const usersQuery = 'SELECT userId,userName,email,userRole,DATE_FORMAT(userDob, "%Y-%m-%d") AS userDob,gender,userPhoneNumber,userRegisteredDate,updatedDate FROM users WHERE status=1 ORDER BY userId DESC'
            db.query(authQueries.usersQuery, async (err, result) => {
                if (err) {
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: "Internal server error" })
                }
                if (result.length < 1) {
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.NODATAFOUND)
                    // return res.status(404).json({ status: 404, error: "User Not Found", })
                }
                return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, result)
                // return res.status(200).json({ status: 200, message: "Users list", data: result })
            })
        } else {
            return returnData(res, 401, ERROR_MESSAGES.ERROR.UNAUTHORIZED)
            // return res.status(401).json({ status: 401, error: "You are not authorized to get Userlist" })
        }
    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:557 ~ module.exports.listUsers= ~ err:", err)
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(500).json({ status: 500, error: "Internal server Error" })
    }
}

// get particular user by id
module.exports.userDetailById = async (req, res) => {
    try {
        const { userId } = req.params

        // const usersQuery = 'SELECT userId,userName,email,userRole,DATE_FORMAT(userDob, "%Y-%m-%d") AS userDob,gender,userPhoneNumber,userRegisteredDate,updatedDate FROM users WHERE userId=? AND status=1'
        db.query(authQueries.particularUserQuery, [userId], async (err, result) => {
            if (err) {
                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                // return res.status(500).json({ status: 500, error: "Internal server error" })
            }
            if (result.length < 1) {
                return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                // return res.status(404).json({ status: 404, error: "User Not Found", })
            }
            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, result)
            // return res.status(200).json({ status: 200, message: "User list", data: result })
        })
    } catch (err) {
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(500).json({ status: 500, error: "Internal Server Error" })
    }
}

// delete user by id
module.exports.deleteUserById = async (req, res) => {
    try {
        const { userId } = req.params

        // const usersQuery = 'UPDATE users SET status=0, updatedDate=? WHERE userId=?'
        db.query(authQueries.deleteUserQuery, [presenttimestamp, userId], async (err, result2) => {
            if (err) {
                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                // return res.status(500).json({ status: 500, error: "Internal server error" })
            }
            // console.log("🚀 ~ file: userservice.js:634 ~ db.query ~ result2:", result2)
            if (result2.affectedRows < 1) {
                return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                // return res.status(404).json({ status: 404, error: "User not Found" })
            }
            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATADELETED)
            // return res.status(200).json({ status: 200, message: "User deleted Successfully" })
        })
    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:557 ~ module.exports.listUsers= ~ err:", err)
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(500).json({ status: 500, error: "Internal Server Error" })
    }
}

// update user details by id
module.exports.updateDetailById = async (req, res) => {
    try {
        const { userName, userRole, userDob, gender, userPhoneNumber, userPassword } = req.body
        const { userId } = req.params

        if (userPassword) {
            bcrypt.hash(userPassword, 9, async (err, hash) => {
                if (err) {
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, Error: "Internal server Error" })
                }
                // const passsQuery = 'UPDATE users SET userPassword=?,updatedDate=? WHERE userId=?'
                // const getEmailQuery = 'SELECT email FROM users WHERE userId=? AND status=1'
                // const updateMetaQuery = "UPDATE metadata SET isForgetPass=0,isChangePass=0,updatedDate=? WHERE userId=?"
                let updateValue = [hash, presenttimestamp, userId, userId, presenttimestamp, userId]
                db.query(`${authQueries.userPassQuery};${authQueries.getEmailQuery};${authQueries.updateMetaAFterPassQuery}`, updateValue, async (err, result) => {
                    if (err) {
                        // console.log("🚀 ~ file: userservice.js:630 ~ db.query ~ err:", err)
                        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                        // return res.status(500).json({ status: 500, error: "Internal server error" })
                    }

                    if (result[1].length > 0) {

                        let subject = "Password Changed"
                        let html = `<div>
                                 <p>As per your request, Password has been Changed and Provided below</p>
                                 <p>Password: ${userPassword}</p>
                                 <p>Click the link to login: <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
                             </div>`

                        try {
                            const response = await usersendMail(result[1][0].email, subject, "", html)
                            // console.log("🚀 ~ file: authServices.js:206 ~ db.query ~ response:", response)
                            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.USERPASSWORDCHANGED)
                        } catch (err) {
                            // console.log("🚀 ~ file: authServices.js:208 ~ db.query ~ err:", err)
                            return returnData(res, 500, ERROR_MESSAGES.ERROR.MAILSENTERROR)
                        }


                        // const mailOptions = {
                        //     from: 'balakrishna.g@dollarbirdinc.com',
                        //     to: `${result[1][0].email}`,
                        //     subject: "Password Changed",
                        //     html: `<div>
                        //         <p>As per your request, Password has been Changed and Provided below</p>
                        //         <p>Password: ${userPassword}</p>
                        //         <p>Click the link to login: <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
                        //     </div>`
                        // };

                        // resetPasswordMail.sendMail(mailOptions, (err, result) => {
                        //     if (err) {
                        //         // console.log("🚀 ~ file: userservice.js:730 ~ resetPasswordMail.sendMail ~ err:", err)
                        //         return res.status(500).json({ status: 500, error: 'Internal Server error' });
                        //     }

                        //     res.status(200).json({ satatus: 200, message: 'Password changed, Email sent to the user email id' });
                        // });
                        // return res.status(200).json({ status: 200, message: "Password changed" })
                    }

                })
            })
        } else {
            let genderGroup = Object.values(CONSTFIELDS.GENDERFIELD)
            if (!genderGroup.includes(gender.toLowerCase().trim())) {
                return returnData(res, 409, ERROR_MESSAGES.ERROR.GENDERERROR)
                // return res.status(409).json({ status: 409, Error: "Gendre shoild be male or female or Other" })
            }

            if (!(RegEx.phone__regEx.test(userPhoneNumber))) {
                return returnData(res, 409, ERROR_MESSAGES.ERROR.VALIDPHONE)
                // return res.status(409).json({ status: 409, Error: "Enter valid Phone Number" })
            }

            // const usersQuery = 'UPDATE users SET userName=?,userRole=?,userDob=?,gender=?,userPhoneNumber=?,updatedDate=? WHERE userId=?'
            let updateValue = [userName, userRole, userDob, gender, userPhoneNumber, presenttimestamp, userId]
            db.query(authQueries.updateUserDetailsQuery, updateValue, async (err, result) => {
                if (err) {
                    // console.log("🚀 ~ file: userservice.js:630 ~ db.query ~ err:", err)
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: "Internal server error" })
                }
                return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAUPDATED)
                // return res.status(200).json({ status: 200, message: "User details updated" })
            })
        }
    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:635 ~ module.exports.updateDetailById= ~ err:=====>", err)
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(500).json({ status: 500, error: "Intrenal Server error" })
    }
}