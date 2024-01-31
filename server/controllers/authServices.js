const bcrypt = require("bcrypt")
var jwt = require('jsonwebtoken');
// const moment = require("moment")

// const db = require("../database/database")
const RegEx = require("../utils/regEx");
const authQueries = require("../database/queries/authqueries");
const ERROR_MESSAGES = require("../utils/constants/messages");
const { presenttimestamp, encryptData, decryptData, returnData, convertToYearFormat, serverErrorMsg } = require("../utils/common");
const { ENVDATA } = require("../config/config");
const { usersendMail } = require("../Middleware/mailcredentials");
const { UTILS } = require("../utils/util.index");
const mySQLInstance = require("../database/classDatabaseConnection");

const QRCode = require("qrcode")

// get userlogData
function extractBrowserFromUserAgent(userAgent) {
    const regex = /(Chrome|Safari|Firefox|Edge|IE|Opera)/i;
    const match = userAgent.match(regex);
    return match ? match[0] : 'Unknown';
}

// for the forget passwords events
const userUpdateSubscribers = [];
// for the qrscan event
const userscanEvent = [];
// for the update after password change
const updatePaswordEvent = [];
// for the update of details of the users
const updateUserDetailEvent = [];



// signup
module.exports.signup = (CONTROLLERS) => async (req, res) => {
    try {
        const { userName, email, userRole, userDob, gender, userPhoneNumber, userPassword } = req.body

        // convert the dateformat to YYYY-MM-DD
        let _userDob = convertToYearFormat(userDob)

        // encrypting the userPassword
        bcrypt.hash(userPassword, 9, async (err, hash) => {
            if (err) {
                return serverErrorMsg(res)
            } else {
                // values to store in user database table
                const values = [userName, email, userRole, _userDob, gender, userPhoneNumber, hash, presenttimestamp, presenttimestamp, 1];
                // executing the query
                mySQLInstance.executeQuery(authQueries.signUpQuery, values).then(async (result) => {

                    // mail sending subject and content
                    let subject = CONTROLLERS.EMAIL_CONTROLLER.EMAIL.SIGNUP_SUBJECT
                    let html = CONTROLLERS.EMAIL_CONTROLLER.EMAIL.SIGNUP_TEMPLATE(email, userPassword)

                    try {
                        // mail sending by passing the  email and password
                        const response = await usersendMail(email, subject, "", html)
                        return returnData(res, 201, ERROR_MESSAGES.SUCCESS.USERREGISTERED)
                    } catch (err) {
                        // console.log("🚀 ~ file: authServices.js:208 ~ db.query ~ err:", err)
                        return returnData(res, 500, ERROR_MESSAGES.ERROR.MAILSENTERROR)
                    }

                }).catch(err => {
                    if (err && err.code === 'ER_DUP_ENTRY') {
                        // throwing the error , if any duplicate entries fornd
                        // unique field based on the unique constraint added to the attributes while creating the table
                        return returnData(res, 400, ERROR_MESSAGES.ERROR.EMAILEXISTS)
                    }
                    // if any other error occurs
                    return serverErrorMsg(res)
                })
            }
        })
    } catch (err) {
        return serverErrorMsg(res)
    }
}

// signin
module.exports.signin = async (req, res) => {
    try {
        // request body
        const { email, password, isAdmin } = req.body;
        /**
         * check the both email and password values
         * if both values available, continue the executing the query
         * else throw error
         */
        if (email && password) {
            // determining whether the user is an administrator or not
            const query = isAdmin ? authQueries.isAdminTrue : authQueries.isUser

            // check the user is present or not on email
            await mySQLInstance.executeQuery(query, [email]).then(result => {
                if (result.length === 0) {
                    // if the result length is zero, throw error
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                } else {
                    // get the user data object
                    const user = result[0];

                    // checking the encrypted password with stored password in db
                    bcrypt.compare(password, user.userPassword, (bcryptErr, isPasswordValid) => {
                        if (bcryptErr) {
                            return serverErrorMsg(res)
                        } else if (!isPasswordValid) {
                            // if password is wrong, throw error
                            return returnData(res, 401, ERROR_MESSAGES.ERROR.INVALIDPASSWORD)
                        } else {
                            /**
                             * if password is correct, sending the response
                             * storing the user related metadata in metadata table
                             */
                            const userAgent = req.headers['user-agent'];
                            const device = userAgent.includes('Mobile') ? 'Mobile' : userAgent.includes('Tablet') ? 'Tablet' : 'Desktop';
                            const ip = req.connection.remoteAddress;

                            const browser = extractBrowserFromUserAgent(userAgent);
                            // values to store in the metadata table
                            const logValues = [user.userId, ip, device, browser, presenttimestamp];

                            /**
                             * encrypting the userdetails to generate the token
                             */
                            const userDataString = JSON.stringify({ email: user.email, roleId: user.userRole });
                            const encryptedData = encryptData(userDataString);
                            // token generated
                            var token = jwt.sign(
                                { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.accesstokenexpiry });

                            // refresh token for regenerating the token
                            var refereshtoken = jwt.sign(
                                { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.refreshtokenexpiry });

                            // query to store the meatadata in table
                            const isUserMetaDataSql = authQueries.isMetadataQuery
                            mySQLInstance.executeQuery(isUserMetaDataSql, [user.userId]).then(results => {
                                /**
                                 * storing the user login details in userlogdata table
                                 * below two contants are query and values 
                                 * if details of the user already exists, updating the table data else adding the data to table
                                  */
                                const metaQuery = results.length > 0 ? authQueries.updateMetaDataQuery : authQueries.insertMetadataQuery
                                const metaValues = results.length > 0 ? [refereshtoken, presenttimestamp, 0, 0, user.userId] : [user.userId, refereshtoken, presenttimestamp, presenttimestamp, 0, 0]

                                // executing the query
                                mySQLInstance.executeQuery(`${authQueries.userlogindataQuery};${metaQuery}`, [...logValues, ...metaValues]).then(logResult => {
                                    // response data 
                                    let data = { token: token, refreshtoken: refereshtoken, email: user.email, roleId: user.userRole, userId: user.userId }
                                    return returnData(res, 200, ERROR_MESSAGES.SUCCESS.LOGIN, data)
                                }).catch(err => {
                                    return returnData(res, 500, ERROR_MESSAGES.ERROR.LOGIN)
                                })
                            }).catch(err => {
                                return serverErrorMsg(res)
                            })
                        }
                    });
                }
            }).catch(err => {
                return serverErrorMsg(res)
            })
            // db.query(query, [email], (err, results) => {
            //     if (err) {
            //         return serverErrorMsg(res)
            //     } else if (results.length === 0) {
            //         return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
            //     } else {
            //         const user = results[0];
            //         bcrypt.compare(password, user.userPassword, (bcryptErr, isPasswordValid) => {
            //             if (bcryptErr) {
            //                 return serverErrorMsg(res)
            //             } else if (!isPasswordValid) {
            //                 return returnData(res, 401, ERROR_MESSAGES.ERROR.INVALIDPASSWORD)
            //             } else {
            //                 const userAgent = req.headers['user-agent'];
            //                 const device = userAgent.includes('Mobile') ? 'Mobile' : userAgent.includes('Tablet') ? 'Tablet' : 'Desktop';
            //                 const ip = req.connection.remoteAddress;

            //                 const browser = extractBrowserFromUserAgent(userAgent);
            //                 // const logQuery = authQueries.userlogindataQuery;
            //                 const logValues = [user.userId, ip, device, browser, presenttimestamp];

            //                 const userDataString = JSON.stringify({ email: user.email, roleId: user.userRole });

            //                 const encryptedData = encryptData(userDataString);

            //                 var token = jwt.sign(
            //                     { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.accesstokenexpiry });

            //                 var refereshtoken = jwt.sign(
            //                     { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.refreshtokenexpiry });

            //                 const isUserMetaDataSql = authQueries.isMetadataQuery
            //                 db.query(isUserMetaDataSql, [user.userId], async (err, result) => {
            //                     if (err) {
            //                         return serverErrorMsg(res)
            //                     } else {
            //                         const metaQuery = result.length > 0 ? authQueries.updateMetaDataQuery : authQueries.insertMetadataQuery
            //                         const metaValues = result.length > 0 ? [refereshtoken, presenttimestamp, 0, 0, user.userId] : [user.userId, refereshtoken, presenttimestamp, presenttimestamp, 0, 0]
            //                         db.query(`${authQueries.userlogindataQuery};${metaQuery}`, [...logValues, ...metaValues], (logErr) => {
            //                             if (logErr) {
            //                                 return returnData(res, 500, ERROR_MESSAGES.ERROR.LOGIN)
            //                             } else {
            //                                 let data = { token: token, refreshtoken: refereshtoken, email: user.email, roleId: user.userRole, userId: user.userId }
            //                                 return returnData(res, 200, ERROR_MESSAGES.SUCCESS.LOGIN, data)
            //                             }
            //                         });
            //                     }
            //                 })
            //             }
            //         });
            //     }
            // });
        } else {
            return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNAMEPASSWORD)
        }
    } catch (err) {
        return serverErrorMsg(res)
    }
}


module.exports.forgotpassword = (CONTROLLERS) => async (req, res) => {
    try {
        const { email } = req.body;
        /**
         * if email present genaerate the token for reset password
         * else throw error
         */
        if (email) {
            await mySQLInstance.executeQuery(authQueries.isUserPresent, [email]).then(async results => {
                // determining the user is exist or not
                if (results.length === 0) {
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                }

                // getting the details of the user
                const user = results[0];

                /**
                 * if user is admin genearate the token for reset password
                 * else sending the message response
                 */
                if (user.userRole == 1) {
                    // encrypting the data to generate the reset password token
                    let resetString = JSON.stringify({ email: user.email, userId: user.userId })
                    const encryptedData = encryptData(resetString);

                    // generating token with time limit
                    var token = jwt.sign(
                        { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.forgottokenexpiry });

                    // sending the mail with reset password link which contains token as params
                    let subject = CONTROLLERS.EMAIL_CONTROLLER.EMAIL.RESET_SUBJECT
                    let text = CONTROLLERS.EMAIL_CONTROLLER.EMAIL.RESET_TEMPLATE(ENVDATA.forgetPasswordlink, token)

                    try {
                        // sending mail to customer email
                        const response = await usersendMail(email, subject, text)
                        return returnData(res, 200, ERROR_MESSAGES.SUCCESS.FORGETTOKENGENERATED)
                    } catch (err) {
                        return returnData(res, 500, ERROR_MESSAGES.ERROR.RESETPASSMAILSENTERROR)
                    }
                } else {
                    // checking for the meatId exist or not
                    await mySQLInstance.executeQuery(authQueries.isMetaIdExist, [user.userId]).then(async (result2) => {
                        /**
                         * updating the user request for password change to admin by updating the value of Forgetquery attribute value to 1
                         * if result occurs update the data to that row in metadata table
                         * else insert the data
                         */
                        const sql = result2.length > 0 ? authQueries.updateMetadataForgetQuery : authQueries.insertMetadataForgetQuery
                        let requsetValues = result2.length > 0 ? [1, presenttimestamp, user.userId] : [user.userId, 1, presenttimestamp, presenttimestamp, 0]
                        await mySQLInstance.executeQuery(sql, requsetValues).then(result3 => {
                            const userUpdate = { message: 'User forget password flag updated', email };
                            // for the sse to recall the list of password change
                            userUpdateSubscribers.forEach((sendUpdate) => {
                                sendUpdate(userUpdate);
                            });
                            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.FORGETPASSWORDNOTIFY, { roleId: user.userRole })

                        }).catch(err => {
                            return serverErrorMsg(res)
                        })
                    }).catch(err => {
                        return serverErrorMsg(res)
                    })
                }
            }).catch(err => {
                return serverErrorMsg(res)
            })
        } else {
            // if email is not enterd, throw error
            return returnData(res, 404, ERROR_MESSAGES.ERROR.VALIDEMAIL)
        }
    } catch (err) {
        return serverErrorMsg(res)
    }
}


//get the forget or change password requests
module.exports.getForgetPassRequests = async (req, res) => {
    try {
        const { result } = req.decodedToken
        /**
         * checking the user is admin or not
         * only admin can get the list
         */
        if (result[0].userRole === 1) {
            // query to get the forget or reset password list for admin only
            await mySQLInstance.executeQuery(authQueries.forgetpasswordlistQuery).then(result => {
                // if no data found, throw error
                if (result.length < 1) {
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.NODATAFOUND)
                }
                // if data, send the data as response
                return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, result)
            }).catch(err => {
                return serverErrorMsg(res)
            })

        } else {
            return returnData(res, 401, ERROR_MESSAGES.ERROR.UNAUTHORIZED)
        }
    } catch (err) {
        return serverErrorMsg(res)
    }
}


// Reset Password for the users by the 
module.exports.resetpassword = async (req, res) => {
    try {
        const { newpassword, confirmpassword } = req.body;
        const { token } = req.params
        /**
         * new password and confirm pasword should be same 
         * else throw error
         */
        if (newpassword == confirmpassword) {
            // hashing the password to store that in db
            bcrypt.hash(newpassword, 9, async (err, hash) => {
                if (err) {
                    return serverErrorMsg(res)
                }
                // checking the token is expired or not
                let data = await jwt.verify(token, ENVDATA.jwtsecretkey);
                let isUser = JSON.parse(decryptData(data.encryptedData))

                // executing the query for resetting the password
                await mySQLInstance.executeQuery(authQueries.resetPassSql, [hash, presenttimestamp, isUser.userId]).then(resukt => {
                    return returnData(res, 200, ERROR_MESSAGES.SUCCESS.RESETPASS)
                }).catch(err => {
                    return serverErrorMsg(res)
                })
            })
        } else {
            return returnData(res, 409, ERROR_MESSAGES.ERROR.NEWANDCONFIRM)
        }
    } catch (err) {
        return returnData(res, 401, ERROR_MESSAGES.ERROR.RESETTOKENEXPIRED)
    }
}

// change password for Admin
module.exports.adminChangePassword = async (req, res) => {
    try {
        const { currentpassword, newpassword, confirmpassword } = req.body;
        const { userId } = req.params
        const { result } = req.decodedToken
        // only the admin can change the password
        if (result[0].userRole === 1) {
            // new password and confirm password should be same, else throw error
            if (newpassword !== confirmpassword) {
                return returnData(res, 400, ERROR_MESSAGES.ERROR.NEWANDCONFIRM)
            }

            // executing the query to get the currentpassword form db
            await mySQLInstance.executeQuery(authQueries.currentpassQuery, [userId]).then(result2 => {
                // if no data found, throwing the error 
                if (result2.length < 1) {
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                }
                /**
                 * checking the current password with existing password
                 */
                bcrypt.compare(currentpassword, result2[0].userPassword, (bcrypterr, isValid) => {
                    if (bcrypterr) {
                        return serverErrorMsg(res)
                    }
                    //  The current password should be the same as the old password
                    if (!isValid) {
                        return returnData(res, 401, ERROR_MESSAGES.ERROR.INVALIDCURRENTPASSWORD)
                    }
                    // current password and new password cannot be same
                    if (currentpassword === newpassword) {
                        return returnData(res, 409, ERROR_MESSAGES.ERROR.NEWANDCONFIRM)
                    }

                    // hashing the new password
                    bcrypt.hash(newpassword, 9, async (err, hash) => {
                        if (err) {
                            return serverErrorMsg(res)
                        }

                        // executing the query to change the password
                        await mySQLInstance.executeQuery(authQueries.changePasswordSql, [hash, presenttimestamp, userId]).thrn(result3 => {
                            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.PASSWORDCHANGED)
                        }).catch(err => {
                            return serverErrorMsg(res)
                        })
                    })
                })
            }).catch(err => {
                return serverErrorMsg(res)
            })

        } else {
            return returnData(res, 401, ERROR_MESSAGES.ERROR.UNAUTHORIZED)
        }
    } catch (err) {
        return serverErrorMsg(res)
    }
}

// refreshtoken
module.exports.refreshtoken = async (req, res) => {
    const { refreshtoken } = req.params
    try {
        // verify the refershtoken
        let data = await jwt.verify(refreshtoken, ENVDATA.jwtsecretkey);

        const encryptedData = data.encryptedData

        // generate the new access token
        var token = jwt.sign(
            { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.accesstokenexpiry });

        return returnData(res, 201, ERROR_MESSAGES.SUCCESS.TOKENGENERATED, { token: token })
    } catch (err) {
        return returnData(res, 401, ERROR_MESSAGES.ERROR.TOKENEXPIRED)
    }
}

// get users
module.exports.listUsers = async (req, res) => {
    try {
        const { result } = req.decodedToken
        let userrole = result[0].userRole
        /**
         * checking the user is admin or not
         * only admin can get the list
         */
        if (userrole == "1") {
            // executing the query to get the list of employees
            await mySQLInstance.executeQuery(authQueries.usersQuery).then(result2 => {
                // if result is not found
                if (result2.length < 1) {
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.NODATAFOUND)
                }
                // result found
                return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, result2)
            }).catch(err => {
                return serverErrorMsg(res)
            })
        } else {
            // if user is not admin, throw error
            return returnData(res, 401, ERROR_MESSAGES.ERROR.UNAUTHORIZED)
        }
    } catch (err) {
        return serverErrorMsg(res)
    }
}

// get particular user by id
module.exports.userDetailById = async (req, res) => {
    try {
        const { userId } = req.params
        // executing the query to get the data of particular user
        await mySQLInstance.executeQuery(authQueries.particularUserQuery, [userId]).then(result2 => {
            // if result is not found
            if (result2.length < 1) {
                return returnData(res, 404, ERROR_MESSAGES.ERROR.NODATAFOUND)
            }
            // result found
            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, result2)
        }).catch(err => {
            return serverErrorMsg(res)
        })
    } catch (err) {
        return serverErrorMsg(res)
    }
}

// delete user by id
module.exports.deleteUserById = async (req, res) => {
    const { userId } = req.params
    // execute the query to delete the user 
    await mySQLInstance.executeQuery(authQueries.deleteUserQuery, [presenttimestamp, userId]).then(result => {
        // if user not found
        if (result.affectedRows < 1) {
            return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
        }
        // user found
        return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATADELETED)
    }).catch(err => {
        return serverErrorMsg(res)
    })
}

// update user details by id
module.exports.updateDetailById = (CONTROLLERS) => async (req, res) => {
    try {
        const { userName, userRole, userDob, gender, userPhoneNumber, userPassword } = req.body
        const { userId } = req.params

        /**
         * checking the request body for userPassword
         * if userPassword present change the password,
         * else update the details of the user
         */
        if (userPassword) {
            // hashing the password to change the password
            bcrypt.hash(userPassword, 9, async (err, hash) => {
                if (err) {
                    return serverErrorMsg(res)
                }
                // query and values for updating the password and triggering the mail
                let query = `${authQueries.userPassQuery};${authQueries.getEmailQuery};${authQueries.updateMetaAFterPassQuery}`;
                let updateValue = [hash, presenttimestamp, userId, userId, presenttimestamp, userId];

                // executing the query
                await mySQLInstance.executeQuery(query, updateValue).then(async (result) => {
                    if (result[1].length > 0) {
                        // content and subject for the email after change password to user
                        let subject = CONTROLLERS.EMAIL_CONTROLLER.EMAIL.PASSWORD_CHANGE_SUBJECT
                        let html = CONTROLLERS.EMAIL_CONTROLLER.EMAIL.PASSWORD_CHANGE_TEMPLATE(userPassword)

                        try {
                            // teriggering the email
                            const response = await usersendMail(result[1][0].email, subject, "", html)

                            // sse for the user after change password
                            const passwordUpdate = ({ message: "password Updated", userId })
                            updatePaswordEvent.forEach((sendUpdate) => {
                                sendUpdate(passwordUpdate)
                            })

                            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.USERPASSWORDCHANGED)
                        } catch (err) {
                            return returnData(res, 500, ERROR_MESSAGES.ERROR.RESETPASSMAILSENTERROR)
                        }
                    }
                }).catch(err => {
                    return serverErrorMsg(res)
                })
            })
        } else {
            // get the values of the gender objects
            let genderGroup = Object.values(UTILS.CONSTANTS.CONSTFIELDS.GENDERFIELD)
            if (!genderGroup.includes(gender.toLowerCase().trim())) {
                return returnData(res, 409, ERROR_MESSAGES.ERROR.GENDERERROR)
            }

            if (!(RegEx.phone__regEx.test(userPhoneNumber))) {
                return returnData(res, 409, ERROR_MESSAGES.ERROR.VALIDPHONE)
            }

            // values to update in db
            let updateValue = [userName, userRole, userDob, gender, userPhoneNumber, presenttimestamp, userId]
            // executing the query to update the details
            await mySQLInstance.executeQuery(authQueries.updateUserDetailsQuery, updateValue).then(result => {
                // triggering the details api in user screen after detail change
                const detailUpdate = ({ message: "Details Updated", userId })
                updateUserDetailEvent.forEach((sendUpdate) => {
                    sendUpdate(detailUpdate)
                })
                return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAUPDATED)
            }).catch(err => {
                return serverErrorMsg(res)
            })
        }
    } catch (err) {
        return serverErrorMsg(res)
    }
}

// event trigger for the request for qrscan login
module.exports.updateScannerEvent = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Function to send data to the admin
    const sendUpdate = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Add the admin's response stream to the list
    userscanEvent.push(sendUpdate);

    // Handle connection closure
    res.on('close', () => {
        // Remove the admin's response stream when they disconnect
        const index = userscanEvent.indexOf(sendUpdate);
        // console.log("🚀 ~ file: authServices.js:673 ~ res.on ~ index:", index)
        if (index !== -1) {
            userscanEvent.splice(index, 1);
        }
    });
}
// event trigger for the request forget password
module.exports.adminForgetEvent = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Function to send data to the admin
    const sendUpdate = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Add the admin's response stream to the list
    userUpdateSubscribers.push(sendUpdate);

    // Handle connection closure
    res.on('close', () => {
        // Remove the admin's response stream when they disconnect
        const index = userUpdateSubscribers.indexOf(sendUpdate);
        // console.log("🚀 ~ file: authServices.js:673 ~ res.on ~ index:", index)
        if (index !== -1) {
            userUpdateSubscribers.splice(index, 1);
        }
    });
}

// trigger event when particular employeedetail updated
module.exports.updateUserEvent = (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Cache-Control", "no-cache")

    const sendUpdate = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`)
    }

    updateUserDetailEvent.push(sendUpdate)

    res.on("close", () => {
        const index = updateUserDetailEvent.indexOf(sendUpdate)
        if (index !== -1) {
            updateUserDetailEvent.splice(index, 1)
        }
    })
}

// trigger event dynamically on password change
module.exports.updatePasswordEvent = (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Cache-Control", "no-cache")

    const sendUpdate = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`)
    }

    updatePaswordEvent.push(sendUpdate)

    res.on("close", () => {
        const index = updatePaswordEvent.indexOf(sendUpdate)
        if (index !== -1) {
            updatePaswordEvent.splice(index, 1)
        }
    })
}


// generate the Qr code

const sessions = {}
const generateSessionId = () => {
    return Math.random().toString(36).substr(2, 10);
}

module.exports.generateQRCode = async (req, res) => {
    try {
        console.log("ENVDATA.jwtsecretkey", ENVDATA.jwtsecretkey)

        let sessionId = generateSessionId()

        sessions[sessionId] = { verified: false, timestamp: presenttimestamp };

        console.log("🚀 ~ module.exports.generateQRCode= ~ sessions:", sessions)

        let data = {
            jwtkey: ENVDATA.jwtsecretkey,
            // website: 'homeBanking',
            time: presenttimestamp,
            sessionId: sessionId
        }

        let _data = encryptData(JSON.stringify(data))
        // console.log("🚀 ~ module.exports.generateQRCode= ~ _data:", _data)

        QRCode.toDataURL(_data, async (err, url) => {
            if (err) {
                console.log("qrerror", err)
                return serverErrorMsg()
            }
            let data = { url: url, sessionId: sessionId }
            return returnData(res, 200, "Qr generated", data)
            // console.log("url", url)
        })

    } catch (err) {
        console.log("err", err)
    }
}

module.exports.verifyQrCode = async (req, res, next) => {
    const { qrcode, userId, seesionId } = req.body
    // console.log("🚀 ~ module.exports.verifyQrCode= ~ userId:", userId)
    // console.log("🚀 ~ module.exports.verifyQrCode= ~ qrcode:", qrcode)
    try {

        let data = JSON.parse(decryptData(qrcode))
        // console.log("🚀 ~ module.exports.verifyQrCode= ~ data:", data.sessionId)
        const session = sessions[data.sessionId]
        // console.log("🚀 ~ module.exports.verifyQrCode= ~ sessions:", sessions)
        // console.log("🚀 ~ module.exports.verifyQrCode= ~ session:", session)
        // console.log("🚀 ~ module.exports.verifyQrCode= ~ session:", session)
        // if (session) {
        if (userId) {
            await mySQLInstance.executeQuery(authQueries.getUserData, [userId]).then((result) => {
                // console.log("🚀 ~ mySQLInstance.executeQuery ~ result:", result)
                let user = result[0]
                // console.log("🚀 ~ awaitmySQLInstance.executeQuery ~ user:", user)
                const userDataString = JSON.stringify({ email: user.email, roleId: user.userRole });
                const encryptedData = encryptData(userDataString);
                // token generated
                var token = jwt.sign(
                    { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.accesstokenexpiry });

                // refresh token for regenerating the token
                var refereshtoken = jwt.sign(
                    { encryptedData }, ENVDATA.jwtsecretkey, { expiresIn: ENVDATA.refreshtokenexpiry });

                let _data = { sessionId: data.sessionId, token: token, refreshtoken: refereshtoken, email: user.email, roleId: user.userRole, userId: user.userId }
                userscanEvent.forEach((sendUpdate) => {
                    sendUpdate(_data);
                });
                return returnData(res, 200, ERROR_MESSAGES.SUCCESS.LOGIN)

            }).catch(err => {
                console.log("🚀 ~ mySQLInstance.executeQuery ~ err:", err)
                return serverErrorMsg()
            })
        } else {
            return serverErrorMsg()
        }

        // }

        // let _data = { token: token, refreshtoken: refereshtoken, email: user.email, roleId: user.userRole, userId: user.userId }

    } catch (err) {
        return serverErrorMsg()
    }
}
