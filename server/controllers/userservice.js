const mySQLInstance = require("../database/classDatabaseConnection")
const db = require("../database/database")
const userQueries = require("../database/queries/userqueries")
const { decryptData, encryptData, returnData, presenttimestamp, serverErrorMsg } = require("../utils/common")
const ERROR_MESSAGES = require("../utils/constants/messages")

// role create Api
module.exports.createrole = async (req, res) => {
    const { roleName, featurePermissions } = req.body
    let _roleName = roleName.toLowerCase().trim()
    if (roleName) {
        try {
            let checkRole = userQueries.isRoleNameExists

            db.query(checkRole, [_roleName], (err, result) => {
                if (err) {
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: 'Internal Server error' });
                } else if (result.length > 0) {
                    let _result = result.filter(item => item.status === 0)
                    _result = _result.map(item => item.roleName.toLowerCase())
                    if (_result.includes(_roleName)) {
                        const rolesql = userQueries.reactivateRole;
                        db.query(rolesql, [presenttimestamp, _roleName], (err, result) => {
                            if (err) {
                                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                // return res.status(500).json({ status: 500, error: 'Internal Server Error' });
                            } else {
                                return returnData(res, 201, ERROR_MESSAGES.SUCCESS.DATADDED)
                                // return res.status(201).json({ status: 201, message: 'Role created successfully' });
                            }
                        });
                    } else {
                        return returnData(res, 409, ERROR_MESSAGES.ERROR.ROLENAMEEXISTS)
                        // return res.status(409).json({ status: 409, error: 'Role name exists' });
                    }
                } else {
                    const rolesql = userQueries.addNewRole;
                    const values = [_roleName, featurePermissions, presenttimestamp, presenttimestamp, 1];
                    db.query(rolesql, values, (err, result) => {
                        if (err) {
                            return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                            // res.status(500).json({ status: 500, error: 'Internal Server Error' });
                        } else {
                            return returnData(res, 201, ERROR_MESSAGES.SUCCESS.DATADDED)
                            // return res.status(201).json({ status: 201, message: 'Role created successfully' });
                        }
                    });
                }
            })
        } catch (err) {
            // console.log("🚀 ~ file: userservice.js:47 ~ module.exports.createrole= ~ err:", err)
            return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
            // return res.status(500).json({ status: 500, error: 'Internal Server Error' });

        } finally {
            // db.end()
        }
    } else {
        return returnData(res, 400, ERROR_MESSAGES.ERROR.ROLENAMEREQUIRED)
    }
}

// role update Api
module.exports.updaterole = async (req, res) => {
    if (roleName) {
        const { roleName, featurePermissions } = req.body
        const { roleId } = req.params
        let _roleName = roleName.toLowerCase().trim()
        try {
            let checkRole = userQueries.isRoleNameExistsOtherthanId;

            db.query(checkRole, [_roleName, roleId], (err, result) => {
                if (err) {
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: 'Internal Server Error' });
                } else if (result?.length > 0) {
                    return returnData(res, 409, ERROR_MESSAGES.ERROR.ROLENAMEEXISTS)
                    // return res.status(409).json({ status: 409, error: 'Role name exists' });
                } else {
                    const rolesql = userQueries.updateRole;
                    db.query(rolesql, [_roleName, featurePermissions, presenttimestamp, roleId], (err, result) => {
                        if (err) {
                            // console.log("🚀 ~ file: userservice.js:105 ~ db.query ~ err:", err)
                            return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                            // return res.status(500).json({ status: 500, error: 'Internal Server Error' });
                        } else {
                            return returnData(res, 201, ERROR_MESSAGES.SUCCESS.DATAUPDATED)
                            // return res.status(201).json({ status: 201, message: 'Role updated successfully' });
                        }
                    });
                }
            })
        } catch (err) {
            // console.error('Error inserting user data:', err);
            return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)

        } finally { }
    } else {
        return returnData(res, 400, ERROR_MESSAGES.ERROR.ROLENAMEREQUIRED)
    }
}

// role get Api
module.exports.getrolelist = async (req, res) => {
    try {
        db.query(userQueries.getRoleList, (err, result) => {
            if (err) {
                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
            } else if (result?.length < 0) {
                return returnData(res, 404, ERROR_MESSAGES.ERROR.NODATAFOUND)
            } else {
                return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, result)
            }
        })
    } catch (err) {
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
    }

}

// delete role
module.exports.deleterole = async (req, res) => {
    try {
        const { roleId } = req.params

        db.query(userQueries.deleteRole, [presenttimestamp, roleId], (err, result) => {
            if (err) {
                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
            }
            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATADELETED)
        })
    } catch (err) {
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
    }
}

// adding creditDebit API 
module.exports.addCreditDebit = async (req, res) => {
    try {
        const { userId, description, creditDate, creditAmount, type } = req.body

        // checking the user query
        let result1 = await mySQLInstance.executeQuery(userQueries.isUser, [userId])
        // .then(result1 => {
        if (result1.length < 1) {
            return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
        } else if (type) {
            // common function to execute query
            const addMoneyDetail = async (sql, values, msg) => {
                let result = await mySQLInstance.executeQuery(sql, values)
                return returnData(res, 201, `${msg} ${ERROR_MESSAGES.SUCCESS.DATADDED}`)
            }

            if (type === "credit") {
                const values = [userId, description, creditDate, creditAmount, presenttimestamp, presenttimestamp, 1];
                addMoneyDetail(userQueries.insertCreditQuery, values, "Credit")
            } else if (type === "debit") {
                const values = [userId, description, creditDate, creditAmount, presenttimestamp, presenttimestamp, 1];
                addMoneyDetail(userQueries.insertDebitQuery, values, "Debit")
            } else if (type === "lending") {
                const values = [userId, description, creditDate, creditAmount, presenttimestamp, presenttimestamp, 1, 0];
                addMoneyDetail(userQueries.insertLendingQuery, values, "Lending")
            } else if (type === "borrow") {
                const values = [userId, description, creditDate, creditAmount, presenttimestamp, presenttimestamp, 1, 0];
                addMoneyDetail(userQueries.insertBorrowQuery, values, "Borrowing")
            } else {
                return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEUNDEFINED)
            }
        } else {
            return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEREQUIRED)
        }

        // }).catch(err => {
        //     return serverErrorMsg(res)
        // })
        // db.query(userQueries.isUser, [userId], async (err, result1) => {
        //     if (err) {
        //         // console.error('Error inserting user data:', err);
        //         return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        //         // return res.status(500).json({ status: 500, error: 'Internal server error' });
        //     } else {
        //         if (result1.length < 1) {
        //             return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
        //             // return res.status(404).json({ status: 404, error: 'User not Found' });
        //         } else if (type) {
        //             const addMoneyDetail = (sql, values, msg) => {
        //                 db.query(sql, values, (err, result) => {
        //                     if (err) {
        //                         // console.error('Error inserting user data:', err);
        //                         return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        //                         // return res.status(500).json({ status: 500, error: 'Internal server error' });
        //                     } else {
        //                         return returnData(res, 201, `${msg} ${ERROR_MESSAGES.SUCCESS.DATADDED}`)
        //                         // return res.status(201).json({ status: 201, message: msg });
        //                     }
        //                 });
        //             }

        //             if (type === "credit") {
        //                 // const sql = 'INSERT INTO creditdata (userId,description,creditDate,creditAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?)';
        //                 const values = [userId, description, creditDate, creditAmount, presenttimestamp, presenttimestamp, 1];
        //                 addMoneyDetail(userQueries.insertCreditQuery, values, "Credit")
        //             } else if (type === "debit") {
        //                 // const sql = 'INSERT INTO debitdata (userId,description,debitDate,debitAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?)';
        //                 const values = [userId, description, creditDate, creditAmount, presenttimestamp, presenttimestamp, 1];
        //                 addMoneyDetail(userQueries.insertDebitQuery, values, "Debit")
        //             } else if (type === "lending") {
        //                 // const sql = 'INSERT INTO lendigdata (userId,description,lendingDate,lendingAmount,createdDate,updatedDate,status,paymentStatus) VALUES (?,?,?,?,?,?,?,?)';
        //                 const values = [userId, description, creditDate, creditAmount, presenttimestamp, presenttimestamp, 1, 0];
        //                 addMoneyDetail(userQueries.insertLendingQuery, values, "Lending")
        //             } else if (type === "borrow") {
        //                 // const sql = 'INSERT INTO borrowingdata (userId,description,borrowDate,borrowAmount,createdDate,updatedDate,status,paymentStatus) VALUES (?,?,?,?,?,?,?,?)';
        //                 const values = [userId, description, creditDate, creditAmount, presenttimestamp, presenttimestamp, 1, 0];
        //                 addMoneyDetail(userQueries.insertBorrowQuery, values, "Borrowing")
        //             } else {
        //                 return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEUNDEFINED)

        //                 // return res.status(400).send({
        //                 //     status: 400,
        //                 //     error: "type is not defined"
        //                 // })
        //             }
        //         } else {
        //             return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEREQUIRED)
        //             // return res.status(400).send({
        //             //     status: 400,
        //             //     error: "type required"
        //             // })
        //         }
        //     }
        // })
    } catch (err) {
        return serverErrorMsg(res)
    }
}

// adding creditDebit API 
module.exports.updateCreditDebit = async (req, res) => {
    try {
        const { description, creditDate, creditAmount, type } = req.body
        const { dataId } = req.params
        if (type) {
            const updateMoneyDetail = (sql, values, msg) => {
                // executing the update credit debit query
                mySQLInstance.executeQuery(sql, values).then(result => {
                    if (result.length < 1) {
                        return returnData(res, 404, ERROR_MESSAGES.ERROR.NODATAFOUND)
                    } else if (result.affectedRows < 1) {
                        return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
                    } else {
                        return returnData(res, 200, `${msg} ${ERROR_MESSAGES.SUCCESS.DATAUPDATED}`)
                    }
                }).catch(err => {
                    return serverErrorMsg(res)
                })
            }

            if (type === "credit") {
                const values = [description, creditDate, creditAmount, presenttimestamp, dataId];
                updateMoneyDetail(userQueries.updateCreditQuery, values, "Credit")
            } else if (type === "debit") {
                const values = [description, creditDate, creditAmount, presenttimestamp, dataId];
                updateMoneyDetail(userQueries.updateDebitQuery, values, "Debit")
            } else if (type === "lending") {
                const values = [description, creditDate, creditAmount, presenttimestamp, dataId];
                updateMoneyDetail(userQueries.updateLendingQuery, values, "Lending")
            } else if (type === "borrow") {
                const values = [description, creditDate, creditAmount, presenttimestamp, dataId];
                updateMoneyDetail(userQueries.updateBorrowQuery, values, "borrowing")
            } else {
                return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEUNDEFINED)
            }
        } else {
            return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEREQUIRED)
        }
    } catch (err) {
        return serverErrorMsg(res)
    }
}

// get creditDebit list API 
module.exports.getCreditDebitList = async (req, res) => {
    try {
        const { type, userId } = req.params

        if (type) {
            const getDetail = (sql) => {
                // executing the get the list of debit credit query
                mySQLInstance.executeQuery(sql, [userId]).then(result => {
                    if (result.length < 1) {
                        return returnData(res, 404, ERROR_MESSAGES.ERROR.NODATAFOUND)
                    } else {
                        return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, result)
                    }
                }).catch(err => {
                    return serverErrorMsg(res)
                })
            }

            if (type === "credit") {
                getDetail(userQueries.getCreditQuery)
            } else if (type === "debit") {
                getDetail(userQueries.getDebitQuery)
            } else if (type === "lending") {
                getDetail(userQueries.getLendingQuery)
            } else if (type === "borrow") {
                getDetail(userQueries.getBorrowQuery)
            } else {
                return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEUNDEFINED)
            }
        } else {
            return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEREQUIRED)
        }
    } catch (err) {
        return serverErrorMsg(res)
    }
}

// delete creditdebit 
module.exports.deleteCreditDebitList = async (req, res) => {
    try {
        const { type, dataId } = req.params
        if (type) {
            const updateMoneyDetail = (sql, values, msg) => {
                // executing the delete the credit debit details query
                mySQLInstance.executeQuery(sql, values).then(result => {
                    if (result.length < 1) {
                        return returnData(res, 404, ERROR_MESSAGES.ERROR.NODATAFOUND)
                    } else if (result.changedRows < 1) {
                        return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
                    } else {
                        return returnData(res, 200, `${msg} ${ERROR_MESSAGES.SUCCESS.DATADELETED}`)
                    }
                }).catch(err => {
                    return serverErrorMsg(res)
                })
            }

            if (type === "credit") {
                const values = [presenttimestamp, dataId];
                updateMoneyDetail(userQueries.deleteCreditQuery, values, "Credit")
            } else if (type === "debit") {
                const values = [presenttimestamp, dataId];
                updateMoneyDetail(userQueries.deleteDebitQuery, values, "Debit")
            } else if (type === "lending") {
                const values = [presenttimestamp, dataId];
                updateMoneyDetail(userQueries.deleteLendingQuery, values, "Lending")
            } else if (type === "borrow") {
                const values = [presenttimestamp, dataId];
                updateMoneyDetail(userQueries.deleteBorrowQuery, values, "borrowed")
            } else {
                return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEUNDEFINED)
            }
        } else {
            return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEREQUIRED)
        }
    } catch (err) {
        return serverErrorMsg(res)
    }
}

// adding paymentdetails API 
module.exports.addPaymentDetails = async (req, res) => {
    try {
        const { userId, lendingId, paymentDescription, paymentDate, paymentAmount, type } = req.body
        // checking type , type should be borrow or lending
        let isBorrowLending = (type === "borrow") || (type === "lending");

        if (isBorrowLending) {
            // checking the user query
            mySQLInstance.executeQuery(userQueries.isUser, [userId]).then(result1 => {
                if (result1.length < 1) {
                    return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                } else {
                    // getting the lending or borrow amount
                    const islending = type === "lending" ? userQueries.getLendingAmountQuery : userQueries.getBorrowAmountQuery
                    const lendValues = [userId, lendingId];
                    // executing query
                    mySQLInstance.executeQuery(islending, lendValues).then(result => {
                        if (result.length < 1) {
                            return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
                        } else {
                            // lending amount or borrow amount
                            const totalAmount = type === "lending" ? result[0].lendingAmount : result[0].borrowAmount

                            // checking and getting paid amount against the totalamount
                            const checkTotalPaymentQuery = type === "lending" ? userQueries.lendingTotalPaymentQuery : userQueries.borrowTotalPaymentQuery
                            //  excecuting query 
                            mySQLInstance.executeQuery(checkTotalPaymentQuery, lendValues).then(result2 => {
                                // total paid amount
                                const totalPayment = result2[0].totalPayment || 0
                                /** 
                                 * if amount is paid fully previously, thrwing error 
                                 * if the paying amount is gretaer than the totalamount, throwing error
                                 * else adding the payment details and updating the paymentstatus of that lending or borrowing amount
                                */
                                if (totalPayment == totalAmount) {
                                    return returnData(res, 400, ERROR_MESSAGES.SUCCESS.PAYMENTDONE)
                                } else if ((totalPayment + paymentAmount) > totalAmount) {
                                    return returnData(res, 400, `Payment Amount exceeds the ${type === "lending" ? "Lending" : "Borrow"} Amount`)
                                } else {
                                    // query for adding the payment details
                                    const sql = type === "lending" ? userQueries.insertLendingPaymentQuery : userQueries.insertBorrowPaymentQuery
                                    // query for updating the payment status
                                    const lendingPaymentSql = ((totalPayment + paymentAmount) === totalAmount) ? (type === "lending" ? userQueries.updateLendingPaymentStatus1Query : userQueries.updateBorrowPaymentStatus1Query)
                                        : (type === "lending" ? userQueries.updateLendingPaymentStatus2Query : userQueries.updateBorrowPaymentStatus2Query)
                                    // query values
                                    const values = [userId, lendingId, paymentDescription, paymentDate, paymentAmount, presenttimestamp, presenttimestamp, 1, lendingId];
                                    // executing queries
                                    mySQLInstance.executeQuery(`${sql};${lendingPaymentSql}`, values).then(result3 => {
                                        if (result3.affectedRows < 1) {
                                            return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
                                            // return res.status(400).json({ status: 400, error: 'Provide valid lending id related to user' });
                                        } else {
                                            return returnData(res, 201, ERROR_MESSAGES.SUCCESS.DATADDED)
                                            // return res.status(201).json({ status: 201, message: "Payment Details updated" });
                                        }
                                    }).catch(err => {
                                        return serverErrorMsg(res)
                                    })
                                }
                            }).catch(err => {
                                return serverErrorMsg(res)
                            })
                            // db.query(checkTotalPaymentQuery, lendValues, async (err, result2) => {
                            //     if (err) {
                            //         // console.log("🚀 ~ file: userservice.js:924 ~ db.query ~ err:", err)
                            //         return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                            //         // return res.status(500).json({ status: 500, error: 'Internal server error' });
                            //     } else {
                            //         // console.log("🚀 ~ file: userservice.js:923 ~ db.query ~ result2:", result2)
                            //         const totalPayment = result2[0].totalPayment || 0
                            //         if (totalPayment == totalAmount) {
                            //             return returnData(res, 400, ERROR_MESSAGES.SUCCESS.PAYMENTDONE)
                            //         } else if ((totalPayment + paymentAmount) > totalAmount) {
                            //             return returnData(res, 400, `Payment Amount exceeds the ${type === "lending" ? "Lending" : "Borrow"} Amount`)
                            //         } else {
                            //             const sql = type === "lending" ? userQueries.insertLendingPaymentQuery : userQueries.insertBorrowPaymentQuery
                            //             const lendingPaymentSql = ((totalPayment + paymentAmount) === totalAmount) ? (type === "lending" ? userQueries.updateLendingPaymentStatus1Query : userQueries.updateBorrowPaymentStatus1Query)
                            //                 : (type === "lending" ? userQueries.updateLendingPaymentStatus2Query : userQueries.updateBorrowPaymentStatus2Query)

                            //             const values = [userId, lendingId, paymentDescription, paymentDate, paymentAmount, presenttimestamp, presenttimestamp, 1, lendingId];
                            //             addPaymentDetail(`${sql};${lendingPaymentSql}`, values)
                            //         }
                            //     }
                            // })
                        }
                    }).catch(err => {
                        return serverErrorMsg(res)
                    })
                    // const addPaymentDetail = (sql, values) => {
                    //     db.query(sql, values, (err, result) => {
                    //         if (err) {
                    //             // console.error('Error inserting user data:', err);
                    //             return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    //             // return res.status(500).json({ status: 500, error: 'Internal server error' });
                    //         } else if (result.affectedRows < 1) {
                    //             return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
                    //             // return res.status(400).json({ status: 400, error: 'Provide valid lending id related to user' });
                    //         } else {
                    //             return returnData(res, 201, ERROR_MESSAGES.SUCCESS.DATADDED)
                    //             // return res.status(201).json({ status: 201, message: "Payment Details updated" });
                    //         }
                    //     });
                    // }
                    // let islending = type === "lending" ? 'SELECT lendingAmount FROM lendigdata WHERE userID=? AND lendId=? AND status=1'
                    //     : 'SELECT borrowAmount FROM borrowingdata WHERE userID=? AND borrowid=? AND status=1'
                    // const islending = type === "lending" ? userQueries.getLendingAmountQuery : userQueries.getBorrowAmountQuery
                    // const lendValues = [userId, lendingId];
                    // db.query(islending, lendValues, (err, result) => {
                    // if (err) {
                    //     // console.error('Error inserting user data:', err);
                    //     return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: 'Internal server error' });
                    // } else if (result.length < 1) {
                    //     return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
                    //     // return res.status(400).json({ status: 400, error: `Provide valid ${type === "lending" ? "lending" : "borrow"} id related to user` });
                    // } else {
                    //     const lendingAmount = type === "lending" ? result[0].lendingAmount : result[0].borrowAmount

                    //     // const checkTotalPaymentQuery = `SELECT SUM(paymentAmount) AS totalPayment FROM paymenthistory WHERE userId = ? AND ${type === "lending" ? "lendId" : "borrowId"} = ? AND status=1`;
                    //     const checkTotalPaymentQuery = type === "lending" ? userQueries.lendingTotalPaymentQuery : userQueries.borrowTotalPaymentQuery
                    //     db.query(checkTotalPaymentQuery, lendValues, async (err, result2) => {
                    //         if (err) {
                    //             // console.log("🚀 ~ file: userservice.js:924 ~ db.query ~ err:", err)
                    //             return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    //             // return res.status(500).json({ status: 500, error: 'Internal server error' });
                    //         } else {
                    //             // console.log("🚀 ~ file: userservice.js:923 ~ db.query ~ result2:", result2)
                    //             const totalPayment = result2[0].totalPayment || 0
                    //             if (totalPayment == lendingAmount) {
                    //                 return returnData(res, 400, ERROR_MESSAGES.SUCCESS.PAYMENTDONE)
                    //                 // return res.status(400).json({ status: 400, error: 'Payment already made/Completed' });
                    //             } else if ((totalPayment + paymentAmount) > lendingAmount) {
                    //                 return returnData(res, 400, `Payment Amount exceeds the ${type === "lending" ? "Lending" : "Borrow"} Amount`)
                    //                 // return res.status(400).json({ status: 400, error: `Payment Amount exceeds the ${type === "lending" ? "Lending" : "Borrow"} Amount` });
                    //             } else {
                    //                 // const sql = type === "lending" ? 'INSERT INTO paymenthistory (userId, lendId, paymentDescription, paymentDate, paymentAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?)'
                    //                 //     : 'INSERT INTO paymenthistory (userId, borrowId, paymentDescription, paymentDate, paymentAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?)';
                    //                 // const lendingPaymentSql = ((totalPayment + paymentAmount) === lendingAmount) ? `UPDATE ${type === "lending" ? "lendigdata" : "borrowingdata"} SET paymentStatus=1 WHERE ${type === "lending" ? "lendId" : "borrowId"}=?`
                    //                 //     : `UPDATE ${type === "lending" ? "lendigdata" : "borrowingdata"} SET paymentStatus=2 WHERE ${type === "lending" ? "lendId" : "borrowId"}=?`

                    //                 const sql = type === "lending" ? userQueries.insertLendingPaymentQuery : userQueries.insertBorrowPaymentQuery
                    //                 const lendingPaymentSql = ((totalPayment + paymentAmount) === lendingAmount) ? (type === "lending" ? userQueries.updateLendingPaymentStatus1Query : userQueries.updateBorrowPaymentStatus1Query)
                    //                     : (type === "lending" ? userQueries.updateLendingPaymentStatus2Query : userQueries.updateBorrowPaymentStatus2Query)

                    //                 const values = [userId, lendingId, paymentDescription, paymentDate, paymentAmount, presenttimestamp, presenttimestamp, 1, lendingId];
                    //                 addPaymentDetail(`${sql};${lendingPaymentSql}`, values)
                    //             }
                    //         }
                    //     })
                    // }
                    // });
                }
            }).catch(err => {
                return serverErrorMsg(res)
            })
            // db.query(userQueries.isUser, [userId], async (err, result1) => {
            //     if (err) {
            //         // console.error('Error inserting user data:', err);
            //         return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
            //         // return res.status(500).json({ status: 500, error: 'Internal server error' });
            //     } else {
            //         if (result1.length < 1) {
            //             return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
            //             // return res.status(404).json({ status: 404, error: 'User not Found' });
            //         } else {

            //             const addPaymentDetail = (sql, values) => {
            //                 db.query(sql, values, (err, result) => {
            //                     if (err) {
            //                         // console.error('Error inserting user data:', err);
            //                         return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
            //                         // return res.status(500).json({ status: 500, error: 'Internal server error' });
            //                     } else if (result.affectedRows < 1) {
            //                         return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
            //                         // return res.status(400).json({ status: 400, error: 'Provide valid lending id related to user' });
            //                     } else {
            //                         return returnData(res, 201, ERROR_MESSAGES.SUCCESS.DATADDED)
            //                         // return res.status(201).json({ status: 201, message: "Payment Details updated" });
            //                     }
            //                 });
            //             }
            //             // let islending = type === "lending" ? 'SELECT lendingAmount FROM lendigdata WHERE userID=? AND lendId=? AND status=1'
            //             //     : 'SELECT borrowAmount FROM borrowingdata WHERE userID=? AND borrowid=? AND status=1'
            //             const islending = type === "lending" ? userQueries.getLendingAmountQuery : userQueries.getBorrowAmountQuery
            //             const lendValues = [userId, lendingId];
            //             db.query(islending, lendValues, (err, result) => {
            //                 if (err) {
            //                     // console.error('Error inserting user data:', err);
            //                     return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
            //                     // return res.status(500).json({ status: 500, error: 'Internal server error' });
            //                 } else if (result.length < 1) {
            //                     return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
            //                     // return res.status(400).json({ status: 400, error: `Provide valid ${type === "lending" ? "lending" : "borrow"} id related to user` });
            //                 } else {
            //                     const lendingAmount = type === "lending" ? result[0].lendingAmount : result[0].borrowAmount

            //                     // const checkTotalPaymentQuery = `SELECT SUM(paymentAmount) AS totalPayment FROM paymenthistory WHERE userId = ? AND ${type === "lending" ? "lendId" : "borrowId"} = ? AND status=1`;
            //                     const checkTotalPaymentQuery = type === "lending" ? userQueries.lendingTotalPaymentQuery : userQueries.borrowTotalPaymentQuery
            //                     db.query(checkTotalPaymentQuery, lendValues, async (err, result2) => {
            //                         if (err) {
            //                             // console.log("🚀 ~ file: userservice.js:924 ~ db.query ~ err:", err)
            //                             return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
            //                             // return res.status(500).json({ status: 500, error: 'Internal server error' });
            //                         } else {
            //                             // console.log("🚀 ~ file: userservice.js:923 ~ db.query ~ result2:", result2)
            //                             const totalPayment = result2[0].totalPayment || 0
            //                             if (totalPayment == lendingAmount) {
            //                                 return returnData(res, 400, ERROR_MESSAGES.SUCCESS.PAYMENTDONE)
            //                                 // return res.status(400).json({ status: 400, error: 'Payment already made/Completed' });
            //                             } else if ((totalPayment + paymentAmount) > lendingAmount) {
            //                                 return returnData(res, 400, `Payment Amount exceeds the ${type === "lending" ? "Lending" : "Borrow"} Amount`)
            //                                 // return res.status(400).json({ status: 400, error: `Payment Amount exceeds the ${type === "lending" ? "Lending" : "Borrow"} Amount` });
            //                             } else {
            //                                 // const sql = type === "lending" ? 'INSERT INTO paymenthistory (userId, lendId, paymentDescription, paymentDate, paymentAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?)'
            //                                 //     : 'INSERT INTO paymenthistory (userId, borrowId, paymentDescription, paymentDate, paymentAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?)';
            //                                 // const lendingPaymentSql = ((totalPayment + paymentAmount) === lendingAmount) ? `UPDATE ${type === "lending" ? "lendigdata" : "borrowingdata"} SET paymentStatus=1 WHERE ${type === "lending" ? "lendId" : "borrowId"}=?`
            //                                 //     : `UPDATE ${type === "lending" ? "lendigdata" : "borrowingdata"} SET paymentStatus=2 WHERE ${type === "lending" ? "lendId" : "borrowId"}=?`

            //                                 const sql = type === "lending" ? userQueries.insertLendingPaymentQuery : userQueries.insertBorrowPaymentQuery
            //                                 const lendingPaymentSql = ((totalPayment + paymentAmount) === lendingAmount) ? (type === "lending" ? userQueries.updateLendingPaymentStatus1Query : userQueries.updateBorrowPaymentStatus1Query)
            //                                     : (type === "lending" ? userQueries.updateLendingPaymentStatus2Query : userQueries.updateBorrowPaymentStatus2Query)

            //                                 const values = [userId, lendingId, paymentDescription, paymentDate, paymentAmount, presenttimestamp, presenttimestamp, 1, lendingId];
            //                                 addPaymentDetail(`${sql};${lendingPaymentSql}`, values)
            //                             }
            //                         }
            //                     })
            //                 }
            //             });
            //         }
            //     }
            // })
        } else {
            return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEUNDEFINED)
        }
    } catch (err) {
        return serverErrorMsg(res)
    }
}

// adding paymentdetails API 
module.exports.updatePaymentDetails = async (req, res) => {
    try {
        const { userId, lendingId, paymentDescription, paymentDate, paymentAmount, type } = req.body
        const { payId } = req.params
        // console.log("🚀 ~ file: userservice.js:957 ~ module.exports.updatePaymentDetails= ~ payId:", typeof (payId), payId || "hello")


        // const isUser = 'SELECT status from users WHERE userId=? and status=1'
        if (type === "lending" || type === "borrow") {
            db.query(userQueries.isUser, [userId], async (err, result1) => {
                if (err) {
                    // console.error('Error inserting user data:', err);
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: 'Internal server error' });
                } else {
                    if (result1.length < 1) {
                        return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                        //  return res.status(404).json({ status: 404, error: 'User not Found' });
                    } else {

                        const updatePaymentDetail = (sql, values) => {
                            db.query(sql, values, (err, result) => {
                                if (err) {
                                    // console.error('Error inserting user data:', err);
                                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                    // return res.status(500).json({ status: 500, error: 'Internal server error' });
                                } else if (result.affectedRows < 1) {
                                    return returnData(res, 400, `Provide valid ${type === "lending" ? "lending" : "borrow"} id related to user`)
                                    // return res.status(400).json({ status: 400, error: `Provide valid ${type === "lending" ? "lending" : "borrow"} id related to user` });
                                } else {
                                    return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAUPDATED)
                                    // return res.status(200).json({ status: 200, message: "Payment Detail updated" });
                                }
                            });
                        }
                        let islending = type === "lending" ? userQueries.getLendingAmountQuery : userQueries.getBorrowAmountQuery
                        const lendValues = [userId, lendingId, payId];
                        db.query(islending, lendValues, (err, result) => {
                            if (err) {
                                // console.error('Error inserting user data:', err);
                                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                // return res.status(500).json({ status: 500, error: 'Internal server error' });
                            } else if (result.length < 1) {
                                return returnData(res, 400, `Provide valid ${type === "lending" ? "lending" : "borrow"} id related to user`)
                                // return res.status(400).json({ status: 400, error: `Provide valid ${type === "lending" ? "lending" : "borrow"} id related to user` });
                            } else {
                                const lendingAmount = type === "lending" ? result[0].lendingAmount : result[0].borrowAmount;
                                const checkPayId = type === "lending" ? userQueries.checkLendingPaymentQuery : userQueries.checkBorrowPaymentQuery
                                // const checkTotalPaymentQuery = `SELECT SUM(paymentAmount) AS totalPayment FROM paymenthistory WHERE userId = ? AND ${type === "lending" ? "lendId" : "borrowId"} = ? AND payId<>? AND status=1`;
                                const checkTotalPaymentQuery = type === "lending" ? userQueries.checkLendingTotalAmountQuery : userQueries.checkBorrowTotalAmountQuery
                                db.query(checkPayId, lendValues, async (err, result2) => {
                                    if (err) {
                                        // console.log("🚀 ~ file: userservice.js:924 ~ db.query ~ err:", err)
                                        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                        // return res.status(500).json({ status: 500, error: 'Internal server error' });
                                    } else if (result2.length < 1) {
                                        return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
                                        // return res.status(400).json({ status: 400, error: `Provide Valid payId related to ${type === "lending" ? "lendingId" : "borrowId"} and userId` });
                                    } else {
                                        db.query(checkTotalPaymentQuery, lendValues, async (err, result3) => {
                                            if (err) {
                                                // console.log("🚀 ~ file: userservice.js:924 ~ db.query ~ err:====>", err)
                                                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                                // return res.status(500).json({ status: 500, error: 'Internal server error' });
                                            } else {
                                                const totalPayment = result3[0].totalPayment || 0

                                                if ((totalPayment + paymentAmount) > lendingAmount) {
                                                    return returnData(res, 400, `Payment Amount exceeds the ${type === "lending" ? "Lending" : "Borrow"} Amount`)
                                                    // return res.status(400).json({ status: 400, error: 'Payment Amount exceeds the Lending Amount' });
                                                } else {
                                                    const sql = userQueries.updatePaymentQuery
                                                    // const sql = 'UPDATE paymenthistory SET paymentDescription=?, paymentDate=?, paymentAmount=?,updatedDate=? WHERE payId=?';
                                                    // const lendingPaymentSql = ((totalPayment + paymentAmount) === lendingAmount) ? `UPDATE ${type === "lending" ? "lendigdata" : "borrowingdata"} SET paymentStatus=1 WHERE ${type === "lending" ? "lendId"
                                                    //     : "borrowId"}=?` : `UPDATE ${type === "lending" ? "lendigdata" : "borrowingdata"} SET paymentStatus=2 WHERE ${type === "lending" ? "lendId" : "borrowId"}=?`

                                                    const lendingPaymentSql = ((totalPayment + paymentAmount) === lendingAmount) ? (type === "lending" ? userQueries.updateLendingPaymentStatus1Query : userQueries.updateBorrowPaymentStatus1Query)
                                                        : (type === "lending" ? userQueries.updateLendingPaymentStatus2Query : userQueries.updateBorrowPaymentStatus2Query)


                                                    const values = [paymentDescription, paymentDate, paymentAmount, presenttimestamp, payId, lendingId];
                                                    updatePaymentDetail(`${sql};${lendingPaymentSql};`, values)
                                                }
                                            }
                                        })
                                    }
                                })
                            }

                        });
                    }
                }
            })
        } else {
            return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEUNDEFINED)
            // return res.status(400).json({
            //     status: 400,
            //     error: "type is not defined"
            // })
        }
    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:705 ~ module.exports.signup= ~ err:===>", err)
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(500).json({
        //     status: 500,
        //     error: "Internal server error"
        // })
    }
}

// get payment Details
module.exports.getPaymentDetails = async (req, res) => {
    try {
        const { userId, lendingId, type } = req.params

        // const isUser = 'SELECT status from users WHERE userId=? and status=1'
        if (type === "borrow" || type === "lending") {
            db.query(userQueries.isUser, [userId], async (err, result1) => {
                if (err) {
                    // console.error('Error inserting user data:', err);
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: 'Internal server error' });
                } else {
                    if (result1.length < 1) {
                        return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                        // return res.status(404).json({ status: 404, error: 'User not Found' });
                    } else {

                        let islending = type === "lending" ? userQueries.getLendingAmountQuery
                            : userQueries.getBorrowAmountQuery
                        const lendValues = [userId, lendingId, userId, lendingId];
                        db.query(islending, lendValues, (err, result) => {
                            if (err) {
                                // console.error('Error inserting user data:', err);
                                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                // return res.status(500).json({ status: 500, error: 'Internal server error' });
                            } else if (result.length < 1) {
                                return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
                                // return res.status(400).json({ status: 400, error: 'Provide valid lending id related to user' });
                            } else {
                                // console.log("🚀 ~ file: userservice.js:1348 ~ db.query ~ result:", result)
                                const getQuery = type === "lending" ? userQueries.getLendingPaymentDetailsQuery : userQueries.getBorrowPaymentDetailsQuery
                                // const getQuery = `SELECT payId,${type === "lending" ? "lendId" : "borrowId"},paymentAmount,paymentDescription,DATE_FORMAT(paymentDate,"%Y-%m-%d") AS paymentDate,createdDate,updatedDate FROM paymenthistory WHERE userId = ? AND ${type === "lending" ? "lendId" : "borrowId"} = ? AND status=1`;
                                // const paymentStatus = type === "lending" ? 'SELECT paymentStatus from lendigdata WHERE userId=? AND lendId=? and status=1'
                                //     : 'SELECT paymentStatus from borrowingdata WHERE userId=? AND borrowId=? and status=1'
                                const paymentStatus = type === "lending" ? userQueries.statusLendingPaymentQuery : userQueries.statusBorrowPaymentQuery
                                db.query(`${getQuery};${paymentStatus};`, lendValues, async (err, result2) => {
                                    if (err) {
                                        // console.log("🚀 ~ file: userservice.js:924 ~ db.query ~ err:", err)
                                        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                        // return res.status(500).json({ status: 500, error: 'Internal server error' });
                                    } else if (result2.length < 1) {
                                        return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                                        // return res.status(404).json({ status: 404, error: 'No Data Found' });
                                    } else {
                                        return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, { paymentData: result2[0], paymentStatus: result2[1][0].paymentStatus })
                                        // return res.status(200).json({ status: 200, message: 'Data Found', data: { paymentData: result2[0], paymentStatus: result2[1][0].paymentStatus } });
                                    }
                                })
                            }
                        });
                    }
                }
            })
        } else {
            return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEUNDEFINED)

            // return res.status(400).json({
            //     status: 400,
            //     error: "type is not defined"
            // })
        }
    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:705 ~ module.exports.signup= ~ err:===>", err)
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(500).json({
        //     status: 500,
        //     error: "Internal server error"
        // })
    }
}

// delete paymentdetails
module.exports.deletePaymentDetails = async (req, res) => {
    try {
        const { payId, userId, lendingId, type } = req.params

        // const isUser = 'SELECT status from users WHERE userId=? and status=1'
        if (type === "lending" || type === "borrow") {
            db.query(userQueries.isUser, [userId], async (err, result1) => {
                if (err) {
                    // console.error('Error inserting user data:', err);
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                    // return res.status(500).json({ status: 500, error: 'Internal server error' });
                } else {
                    if (result1.length < 1) {
                        return returnData(res, 404, ERROR_MESSAGES.ERROR.USERNOTFOUND)
                        // return res.status(404).json({ status: 404, error: 'User not Found' });
                    } else {

                        const updatePaymentDetail = (sql, values) => {
                            db.query(sql, values, (err, result) => {
                                if (err) {
                                    // console.error('Error inserting user data:', err);
                                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                    // return res.status(500).json({ status: 500, error: 'Internal server error' });
                                } else if (result.affectedRows < 1) {
                                    return returnData(res, 400, `Provide valid ${type === "lending" ? "lending" : "borrow"} id related to user`)
                                    // return res.status(400).json({ status: 400, error: `Provide valid ${type === "lending" ? "lending" : "borrow"} id related to user` });
                                } else {
                                    return returnData(res, 200, ERROR_MESSAGES.SUCCESS.PAYMENTDETAILDEL)
                                    // return res.status(200).json({ status: 200, message: "Payment Detail deleted" });
                                }
                            });
                        }
                        let islending = type === "lending" ? userQueries.getLendingAmountQuery : userQueries.getBorrowAmountQuery
                        const lendValues = [userId, lendingId, payId];
                        db.query(islending, lendValues, (err, result) => {
                            if (err) {
                                // console.error('Error inserting user data:', err);
                                return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                // return res.status(500).json({ status: 500, error: 'Internal server error' });
                            } else if (result.length < 1) {
                                return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
                                // return res.status(400).json({ status: 400, error: `Provide valid ${type === "lending" ? "lending" : "borrow"} id related to user` });
                            } else {

                                // const checkPayId = `SELECT paymentAmount FROM paymenthistory WHERE userId = ? AND ${type === "lending" ? "lendId" : "borrowId"} = ? AND payId=? AND status=1`;
                                const checkPayId = type === "lending" ? userQueries.checkLendingPaymentQuery : userQueries.checkBorrowPaymentQuery
                                db.query(checkPayId, lendValues, async (err, result2) => {
                                    if (err) {
                                        // console.log("🚀 ~ file: userservice.js:924 ~ db.query ~ err:", err)
                                        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                                        // return res.status(500).json({ status: 500, error: 'Internal server error' });
                                    } else if (result2.length < 1) {
                                        return returnData(res, 400, ERROR_MESSAGES.ERROR.ENTERVALIDID)
                                        // return res.status(400).json({ status: 400, error: `Provide Valid payId related to ${type === "lending" ? "lendingId" : "borrowid"} and userId` });
                                    } else {
                                        // const sql = 'UPDATE paymenthistory SET status=0,updatedDate=? WHERE payId=?';
                                        // const lendingPaymentSql = `UPDATE ${type === "lending" ? "lendigdata" : "borrowingdata"} SET paymentStatus=2 where ${type === "lending" ? "lendId" : "borrowId"}=?`
                                        const lendingPaymentSql = type === "lending" ? userQueries.updateLendingPaymentStatus2Query : userQueries.updateBorrowPaymentStatus2Query

                                        const values = [presenttimestamp, payId, lendingId];
                                        updatePaymentDetail(`${userQueries.deletePaymentQuery};${lendingPaymentSql};`, values)
                                    }
                                })
                            }
                        });

                    }
                }
            })
        } else {
            return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEUNDEFINED)
        }
    } catch (err) {
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
    }
}

// get the chart data for dashboard
module.exports.getChartdata = async (req, res) => {
    try {
        const { userId, monthoryear, date } = req.params
        let year = new Date(date).getFullYear()
        let _month = new Date(date).getMonth() + 1
        let month = (new Date(date)).toLocaleDateString("default", { month: "long" })

        const getChart = (sql, values) => {
            db.query(sql, values, async (err, result) => {
                if (err) {
                    return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
                } else {
                    // console.log("🚀 ~ file: userservice.js:1463 ~ db.query ~ result:", result)
                    // let totalCredit = 0;
                    // let totaldebit = 0;
                    // if (monthoryear === "year") {
                    //     let _totalCredit = result[0].filter(item => item.year === year)
                    //     let _totaldebit = result[1].filter(item => item.year === year)
                    //     totalCredit = _totalCredit[0]?.totalAmount || 0
                    //     totaldebit = _totaldebit[0]?.totalAmount || 0

                    // } else if (monthoryear === "month") {
                    //     let _totalCredit = result[0].filter(item => item.month === month)
                    //     let _totaldebit = result[1].filter(item => item.month === month)
                    //     totalCredit = _totalCredit[0]?.totalAmount || 0
                    //     totaldebit = _totaldebit[0]?.totalAmount || 0
                    // }
                    let totalCredit = result[0].reduce((sum, entry) => sum + Number(entry.totalAmount || 0), 0)
                    let totaldebit = result[1].reduce((sum, entry) => sum + Number(entry.totalAmount || 0), 0)
                    let data = {
                        // creditData: result[0], debitData: result[1], lendingData: result[2],
                        // totalUsers: result[2][0].totalUsers,
                        // totalCredit: totalCredit, totalDebit: totaldebit
                        creditData: result[0], debitData: result[1],
                        totalCredit: totalCredit, totalDebit: totaldebit
                    }
                    // console.log("🚀 ~ db.query ~ data:", data)
                    return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, data)

                }
            })
        }

        if (monthoryear === "allyear") {
            getChart(`${userQueries.yearCreditChartQuery};${userQueries.yearDebitChartQuery};`, [userId, userId])
        } else if (monthoryear === "year") {
            getChart(`${userQueries.monthCreditChartQuery};${userQueries.monthDebitChartQuery};`, [userId, year, userId, year])
        } else if (monthoryear === "month") {
            getChart(`${userQueries.dayCreditChartQuery};${userQueries.dayDebitChartQuery}`, [userId, year, _month, userId, year, _month])
        } else {
            return returnData(res, 400, ERROR_MESSAGES.ERROR.TYPEUNDEFINED)
        }

    } catch (err) {
        // console.log("🚀 ~ file: userservice.js:1455 ~ module.exports.getChartdata= ~ err:", err)
        return returnData(res, 500, ERROR_MESSAGES.ERROR.SERVER)
        // return res.status(500).json({ status: 500, error: `server error` })
    }

}

// get the available balance and total active users
module.exports.getTotalBalance = async (req, res) => {
    try {
        const { userId } = req.params
        mySQLInstance.executeQuery(`${userQueries.totalUsersQuery};${userQueries.balanceQuery};`, [userId, userId]).then(result => {
            let data = {
                totalUsers: result[0][0]?.totalUsers,
                available_balance: result[1][0].available_balance || 0
            }
            return returnData(res, 200, ERROR_MESSAGES.SUCCESS.DATAFOUND, data)
        }).catch(err => {
            return serverErrorMsg(res)
        })

    } catch (err) {
        return serverErrorMsg(res)
    }
}