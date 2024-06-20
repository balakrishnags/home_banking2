const { DATA_TABLES } = require("../../utils/constants/constants");

const userQueries = {
    // role qureries
    isRoleNameExists: `SELECT roleName,status FROM ${DATA_TABLES.ROLE} WHERE roleName LIKE ?`,
    // checking the rolename except the update role id
    isRoleNameExistsOtherthanId: `SELECT roleName, roleId FROM ${DATA_TABLES.ROLE} WHERE roleName LIKE ? AND roleId <> ? AND status=1`,
    // update role if it is inactive
    reactivateRole: `UPDATE ${DATA_TABLES.ROLE} SET status=1,updatedDate=? WHERE roleName=?`,
    // create new role
    addNewRole: `INSERT INTO ${DATA_TABLES.ROLE} (roleName, featurePermissions,createdDate,updatedDate,status) VALUES (?,?,?,?,?)`,
    // update role
    updateRole: `UPDATE ${DATA_TABLES.ROLE} SET roleName=?, featurePermissions=?,updatedDate=? WHERE roleId=?`,
    // get role list
    getRoleList: `SELECT * FROM ${DATA_TABLES.ROLE} WHERE status=1`,
    // delete roles(soft)
    deleteRole: `UPDATE ${DATA_TABLES.ROLE} SET status=0, updatedDate=? WHERE roleId = ?`,

    // checking the user and userRole
    userRoleQuery: `SELECT userRole FROM ${DATA_TABLES.USERS} WHERE email=? AND status=1`,
    // user is active or deleted Query
    isUser: `SELECT status from ${DATA_TABLES.USERS} WHERE userId=? and status=1`,
    // credit data insert query
    insertCreditQuery: `INSERT INTO ${DATA_TABLES.CREDIT_DATA} (userId,description,creditDate,creditAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?)`,
    // debit data insert query
    insertDebitQuery: `INSERT INTO ${DATA_TABLES.DEBIT_DATA} (userId,description,debitDate,debitAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?)`,
    // lending data insert query
    insertLendingQuery: `INSERT INTO ${DATA_TABLES.LENDING_DATA} (userId,description,lendingDate,lendingAmount,createdDate,updatedDate,status,paymentStatus) VALUES (?,?,?,?,?,?,?,?)`,
    // borrow data insert query
    insertBorrowQuery: `INSERT INTO ${DATA_TABLES.BORROW_DATA} (userId,description,borrowDate,borrowAmount,createdDate,updatedDate,status,paymentStatus) VALUES (?,?,?,?,?,?,?,?)`,
    // update credit data query
    updateCreditQuery: `UPDATE ${DATA_TABLES.CREDIT_DATA} SET description=?,creditDate=?,creditAmount=?,updatedDate=? WHERE creditId=? AND status=1`,
    // update debit data query
    updateDebitQuery: `UPDATE ${DATA_TABLES.DEBIT_DATA} SET description=?,debitDate=?,debitAmount=?,updatedDate=? WHERE debitId=? AND status=1`,
    // update lending data query
    updateLendingQuery: `UPDATE ${DATA_TABLES.LENDING_DATA} SET description=?,lendingDate=?,lendingAmount=?,updatedDate=? WHERE lendId=? AND status=1`,
    // update borrow data query
    updateBorrowQuery: `UPDATE ${DATA_TABLES.BORROW_DATA} SET description=?,borrowDate=?,borrowAmount=?,updatedDate=? WHERE borrowId=? AND status=1`,
    // get the credit data query
    getCreditQuery: `SELECT creditId,description,DATE_FORMAT(creditDate, "%Y-%m-%d") AS creditDate,creditAmount,createdDate,updatedDate FROM ${DATA_TABLES.CREDIT_DATA} WHERE userId=? AND status=1 ORDER BY creditDate DESC,creditId DESC`,
    // get the debit data query
    getDebitQuery: `SELECT debitId,description,DATE_FORMAT(debitDate, "%Y-%m-%d") AS debitDate,debitAmount,createdDate,updatedDate FROM ${DATA_TABLES.DEBIT_DATA} WHERE userId=? AND status=1 ORDER BY debitDate DESC,debitId DESC`,
    // get the lending data query
    getLendingQuery: `SELECT ld.lendId, ld.lendingAmount, DATE_FORMAT(ld.lendingDate, "%Y-%m-%d") AS lendingDate,
                            ld.description,ld.paymentStatus, SUM(pt.paymentAmount) AS totalPaymentAmount,
                            ld.lendingAmount - SUM(pt.paymentAmount) AS pendingAmount
                            FROM
                                ${DATA_TABLES.LENDING_DATA} ld
                            LEFT JOIN
                            ${DATA_TABLES.PAYMENT_DATA} pt ON ld.lendId = pt.lendId AND pt.status = 1
                            where ld.userId=? AND ld.status=1
                            GROUP BY
                                ld.lendId, ld.lendingAmount
                            ORDER BY
                                ld.lendingDate DESC`,
    // get the borrow data query
    getBorrowQuery: `SELECT ld.borrowId, ld.borrowAmount, DATE_FORMAT(ld.borrowDate, "%Y-%m-%d") AS borrowDate,
                            ld.description,ld.paymentStatus, SUM(pt.paymentAmount) AS totalPaymentAmount,
                            ld.borrowAmount - SUM(pt.paymentAmount) AS pendingAmount
                            FROM
                                ${DATA_TABLES.BORROW_DATA} ld
                            LEFT JOIN
                            ${DATA_TABLES.PAYMENT_DATA} pt ON ld.borrowId = pt.borrowId AND pt.status = 1
                            where ld.userId=? AND ld.status=1
                            GROUP BY
                                ld.borrowId, ld.borrowAmount
                            ORDER BY
                                ld.borrowDate DESC`,

    // delete the credit data Query
    deleteCreditQuery: `UPDATE ${DATA_TABLES.CREDIT_DATA} SET status=0,updatedDate=? WHERE creditId=?`,
    // delete the debit data Query
    deleteDebitQuery: `UPDATE ${DATA_TABLES.DEBIT_DATA} SET status=0,updatedDate=? WHERE debitId=?`,
    // delete the lending data Query
    deleteLendingQuery: `UPDATE ${DATA_TABLES.LENDING_DATA} SET status=0,updatedDate=? WHERE lendId=?`,
    // delete the borrow data Query
    deleteBorrowQuery: `UPDATE ${DATA_TABLES.BORROW_DATA} SET status=0,updatedDate=? WHERE borrowId=?`,
    // get lendingAmount from lendid query
    getLendingAmountQuery: `SELECT lendingAmount FROM ${DATA_TABLES.LENDING_DATA} WHERE userID=? AND lendId=? AND status=1`,
    // get borrowAmount from borrowid query
    getBorrowAmountQuery: `SELECT borrowAmount FROM ${DATA_TABLES.BORROW_DATA} WHERE userID=? AND borrowId=? AND status=1`,
    // lending total Payment Query
    lendingTotalPaymentQuery: `SELECT SUM(paymentAmount) AS totalPayment FROM ${DATA_TABLES.PAYMENT_DATA} WHERE userId = ? AND lendId = ? AND status=1`,
    // borrow total Payment Query
    borrowTotalPaymentQuery: `SELECT SUM(paymentAmount) AS totalPayment FROM ${DATA_TABLES.PAYMENT_DATA} WHERE userId = ? AND  borrowId = ? AND status=1`,
    // insert lending payment data query
    insertLendingPaymentQuery: `INSERT INTO ${DATA_TABLES.PAYMENT_DATA} (userId, lendId, paymentDescription, paymentDate, paymentAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?)`,
    // insert borrow payment data query
    insertBorrowPaymentQuery: `INSERT INTO ${DATA_TABLES.PAYMENT_DATA} (userId, borrowId, paymentDescription, paymentDate, paymentAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?)`,
    // update the paymentstatus of lending if fully paid
    updateLendingPaymentStatus1Query: `UPDATE ${DATA_TABLES.LENDING_DATA} SET paymentStatus=1 WHERE lendId=?`,
    // update the paymentstatus of lending if fully paid
    updateBorrowPaymentStatus1Query: `UPDATE ${DATA_TABLES.BORROW_DATA} SET paymentStatus=1 WHERE borrowId=?`,
    // update the paymentstatus of lending if not fully paid
    updateLendingPaymentStatus2Query: `UPDATE ${DATA_TABLES.LENDING_DATA} SET paymentStatus=2 WHERE lendId=?`,
    // update the paymentstatus of lending if not fully paid
    updateBorrowPaymentStatus2Query: `UPDATE ${DATA_TABLES.BORROW_DATA} SET paymentStatus=2 WHERE borrowId=?`,
    // check the lending payment is made or not query
    checkLendingPaymentQuery: `SELECT paymentAmount FROM ${DATA_TABLES.PAYMENT_DATA} WHERE userId = ? AND lendId = ? AND payId=? AND status=1`,
    // check the borrow payment is made or not query
    checkBorrowPaymentQuery: `SELECT paymentAmount FROM ${DATA_TABLES.PAYMENT_DATA} WHERE userId = ? AND borrowId = ? AND payId=? AND status=1`,
    // check lending total payment amount query
    checkLendingTotalAmountQuery: `SELECT SUM(paymentAmount) AS totalPayment FROM ${DATA_TABLES.PAYMENT_DATA} WHERE userId = ? AND lendId = ? AND payId<>? AND status=1`,
    // check borrow total payment amount query
    checkBorrowTotalAmountQuery: `SELECT SUM(paymentAmount) AS totalPayment FROM ${DATA_TABLES.PAYMENT_DATA} WHERE userId = ? AND borrowId = ? AND payId<>? AND status=1`,
    // update the lending payment data Query
    updatePaymentQuery: `UPDATE ${DATA_TABLES.PAYMENT_DATA} SET paymentDescription=?, paymentDate=?, paymentAmount=?,updatedDate=? WHERE payId=?`,
    // get the payment details related to the lending
    getLendingPaymentDetailsQuery: `SELECT payId,lendId,paymentAmount,paymentDescription,DATE_FORMAT(paymentDate,"%Y-%m-%d") AS paymentDate,createdDate,updatedDate FROM ${DATA_TABLES.PAYMENT_DATA} WHERE userId = ? AND lendId = ? AND status=1`,
    // get the payment details related to the borrow
    getBorrowPaymentDetailsQuery: `SELECT payId,borrowId,paymentAmount,paymentDescription,DATE_FORMAT(paymentDate,"%Y-%m-%d") AS paymentDate,createdDate,updatedDate FROM ${DATA_TABLES.PAYMENT_DATA} WHERE userId = ? AND borrowId = ? AND status=1`,
    // paymentstatus of lending data
    statusLendingPaymentQuery: `SELECT paymentStatus from ${DATA_TABLES.LENDING_DATA} WHERE userId=? AND lendId=? and status=1`,
    // paymentstatus of borrow data
    statusBorrowPaymentQuery: `SELECT paymentStatus from ${DATA_TABLES.BORROW_DATA} WHERE userId=? AND borrowId=? and status=1`,
    // delete payment details
    deletePaymentQuery: `UPDATE ${DATA_TABLES.PAYMENT_DATA} SET status=0,updatedDate=? WHERE payId=?`,

    // get tital users Count
    totalUsersQuery: `SELECT COUNT(userId) AS totalUsers FROM ${DATA_TABLES.USERS} WHERE status=1`,


    // chart queries
    // year data query
    // credit chart
    yearCreditChartQuery: `select year(creditDate) as year, SUM(creditAmount) as totalAmount from ${DATA_TABLES.CREDIT_DATA} 
    where userId = ? AND status=1 group by year(creditDate) order by year ASC`,
    // debit chart
    yearDebitChartQuery: `select year(debitDate) as year, SUM(debitAmount) as totalAmount from ${DATA_TABLES.DEBIT_DATA}
    where userId = ? AND status=1 group by year(debitDate) order by year ASC`,
    // lending chart
    yearLendingChartQuery: `select year(lendingDate) as year, SUM(lendingAmount) as totalAmount from ${DATA_TABLES.LENDING_DATA}
    where userId = ? AND status=1 group by year(lendingDate) order by year ASC`,

    // month data query
    // credit chart
    monthCreditChartQuery: `select monthname(creditDate) as month, SUM(creditAmount) as totalAmount from ${DATA_TABLES.CREDIT_DATA} 
    where userId=? and year(creditDate)=? AND status=1 group by monthname(creditDate) order by month ASC `,
    monthDebitChartQuery: `select monthname(debitDate) as month, SUM(debitAmount) as totalAmount from ${DATA_TABLES.DEBIT_DATA} 
    where userId = ? AND year(debitDate)=? AND status=1 group by monthname(debitDate) order by month ASC`,
    dayCreditChartQuery: `SELECT DAY(creditDate) as day, SUM(creditAmount) as totalAmount
                            FROM
                               ${DATA_TABLES.CREDIT_DATA}
                            WHERE
                                userId = ? AND  YEAR(creditDate) = ? AND  MONTH(creditDate) = ? AND status = 1
                            GROUP BY
                               YEAR(creditDate), MONTH(creditDate), DAY(creditDate)
                            ORDER BY
                                day asc`,
    dayDebitChartQuery: `SELECT DAY(debitDate) as day, SUM(debitAmount) as totalAmount
                            FROM
                               ${DATA_TABLES.DEBIT_DATA}
                            WHERE
                                userId = ? AND  YEAR(debitDate) = ? AND  MONTH(debitDate) = ? AND status = 1
                            GROUP BY
                               YEAR(debitDate), MONTH(debitDate), DAY(debitDate)
                            ORDER BY
                                day asc`,
    monthLendingChartQuery: `select monthname(lendingDate) as month, SUM(lendingAmount) as totalAmount from ${DATA_TABLES.LENDING_DATA} 
    where userId = ? AND year(lendingDate)=? AND status=1 group by monthname(lendingDate) order by month ASC`,

    // to get the balance
    // balanceQuery: `select SUM(creditAmount) - SUM(debitAmount) AS available_balance
    //     FROM (
    //         SELECT  IFNULL(creditAmount, 0) AS creditAmount, 0 AS debitAmount
    //         FROM home_banking.${CREDIT_DATA}
    //         WHERE userId = ?
    //         UNION ALL
    //         SELECT 0 AS creditAmount, IFNULL(debitAmount, 0) AS debitAmount
    //         FROM home_banking.${DEBIT_DATA}
    //         WHERE userId = ?
    //     ) AS transactions`
    balanceQuery: `SELECT SUM(c.creditAmount) - (SELECT SUM(d.debitAmount) FROM ${DATA_TABLES.DEBIT_DATA} d WHERE userId =? AND status=1) as available_balance
     FROM ${DATA_TABLES.CREDIT_DATA} c WHERE userId =? AND status=1`

}

module.exports = userQueries;