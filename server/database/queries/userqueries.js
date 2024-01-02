const userQueries = {
    // user is active or deleted Query
    isUser: 'SELECT status from users WHERE userId=? and status=1',
    // credit data insert query
    insertCreditQuery: 'INSERT INTO creditdata (userId,description,creditDate,creditAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?)',
    // debit data insert query
    insertDebitQuery: 'INSERT INTO debitdata (userId,description,debitDate,debitAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?)',
    // lending data insert query
    insertLendingQuery: 'INSERT INTO lendigdata (userId,description,lendingDate,lendingAmount,createdDate,updatedDate,status,paymentStatus) VALUES (?,?,?,?,?,?,?,?)',
    // borrow data insert query
    insertBorrowQuery: 'INSERT INTO borrowingdata (userId,description,borrowDate,borrowAmount,createdDate,updatedDate,status,paymentStatus) VALUES (?,?,?,?,?,?,?,?)',
    // update credit data query
    updateCreditQuery: 'UPDATE creditdata SET description=?,creditDate=?,creditAmount=?,updatedDate=? WHERE creditId=? AND status=1',
    // update debit data query
    updateDebitQuery: 'UPDATE debitdata SET description=?,debitDate=?,debitAmount=?,updatedDate=? WHERE debitId=? AND status=1',
    // update lending data query
    updateLendingQuery: 'UPDATE lendigdata SET description=?,lendingDate=?,lendingAmount=?,updatedDate=? WHERE lendId=? AND status=1',
    // update borrow data query
    updateBorrowQuery: 'UPDATE borrowingdata SET description=?,borrowDate=?,borrowAmount=?,updatedDate=? WHERE borrowId=? AND status=1',
    // get the credit data query
    getCreditQuery: 'SELECT creditId,description,DATE_FORMAT(creditDate, "%Y-%m-%d") AS creditDate,creditAmount,createdDate,updatedDate FROM creditdata WHERE userId=? AND status=1 ORDER BY creditDate DESC',
    // get the debit data query
    getDebitQuery: 'SELECT debitId,description,DATE_FORMAT(debitDate, "%Y-%m-%d") AS debitDate,debitAmount,createdDate,updatedDate FROM debitdata WHERE userId=? AND status=1 ORDER BY debitDate DESC',
    // get the lending data query
    getLendingQuery: `SELECT ld.lendId, ld.lendingAmount, DATE_FORMAT(ld.lendingDate, "%Y-%m-%d") AS lendingDate,
                            ld.description,ld.paymentStatus, SUM(pt.paymentAmount) AS totalPaymentAmount,
                            ld.lendingAmount - SUM(pt.paymentAmount) AS pendingAmount
                            FROM
                                home_banking.lendigdata ld
                            LEFT JOIN
                            home_banking.paymenthistory pt ON ld.lendId = pt.lendId AND pt.status = 1
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
                                home_banking.borrowingdata ld
                            LEFT JOIN
                            home_banking.paymenthistory pt ON ld.borrowId = pt.borrowId AND pt.status = 1
                            where ld.userId=? AND ld.status=1
                            GROUP BY
                                ld.borrowId, ld.borrowAmount
                            ORDER BY
                                ld.borrowDate DESC`,

    // delete the credit data Query
    deleteCreditQuery: 'UPDATE creditdata SET status=0,updatedDate=? WHERE creditId=?',
    // delete the debit data Query
    deleteDebitQuery: 'UPDATE debitdata SET status=0,updatedDate=? WHERE debitId=?',
    // delete the lending data Query
    deleteLendingQuery: 'UPDATE lendigdata SET status=0,updatedDate=? WHERE lendId=?',
    // delete the borrow data Query
    deleteBorrowQuery: 'UPDATE borrowingdata SET status=0,updatedDate=? WHERE borrowId=?',
    // get lendingAmount from lendid query
    getLendingAmountQuery: 'SELECT lendingAmount FROM lendigdata WHERE userID=? AND lendId=? AND status=1',
    // get borrowAmount from borrowid query
    getBorrowAmountQuery: 'SELECT borrowAmount FROM borrowingdata WHERE userID=? AND borrowid=? AND status=1',
    // lending total Payment Query
    lendingTotalPaymentQuery: `SELECT SUM(paymentAmount) AS totalPayment FROM paymenthistory WHERE userId = ? AND lendId = ? AND status=1`,
    // borrow total Payment Query
    borrowTotalPaymentQuery: `SELECT SUM(paymentAmount) AS totalPayment FROM paymenthistory WHERE userId = ? AND  borrowId = ? AND status=1`,
    // insert lending payment data query
    insertLendingPaymentQuery: 'INSERT INTO paymenthistory (userId, lendId, paymentDescription, paymentDate, paymentAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?)',
    // insert borrow payment data query
    insertBorrowPaymentQuery: 'INSERT INTO paymenthistory (userId, borrowId, paymentDescription, paymentDate, paymentAmount,createdDate,updatedDate,status) VALUES (?,?,?,?,?,?,?,?)',
    // update the paymentstatus of lending if fully paid
    updateLendingPaymentStatus1Query: `UPDATE lendigdata SET paymentStatus=1 WHERE lendId=?`,
    // update the paymentstatus of lending if fully paid
    updateBorrowPaymentStatus1Query: `UPDATE borrowingdata SET paymentStatus=1 WHERE borrowId=?`,
    // update the paymentstatus of lending if not fully paid
    updateLendingPaymentStatus2Query: `UPDATE lendigdata SET paymentStatus=2 WHERE lendId=?`,
    // update the paymentstatus of lending if not fully paid
    updateBorrowPaymentStatus2Query: `UPDATE borrowingdata SET paymentStatus=2 WHERE borrowId=?`,
    // check the lending payment is made or not query
    checkLendingPaymentQuery: `SELECT paymentAmount FROM paymenthistory WHERE userId = ? AND lendId = ? AND payId=? AND status=1`,
    // check the borrow payment is made or not query
    checkBorrowPaymentQuery: `SELECT paymentAmount FROM paymenthistory WHERE userId = ? AND borrowId = ? AND payId=? AND status=1`,
    // check lending total payment amount query
    checkLendingTotalAmountQuery: `SELECT SUM(paymentAmount) AS totalPayment FROM paymenthistory WHERE userId = ? AND lendId = ? AND payId<>? AND status=1`,
    // check borrow total payment amount query
    checkBorrowTotalAmountQuery: `SELECT SUM(paymentAmount) AS totalPayment FROM paymenthistory WHERE userId = ? AND borrowId = ? AND payId<>? AND status=1`,
    // update the lending payment data Query
    updatePaymentQuery: 'UPDATE paymenthistory SET paymentDescription=?, paymentDate=?, paymentAmount=?,updatedDate=? WHERE payId=?',
    // get the payment details related to the lending
    getLendingPaymentDetailsQuery: `SELECT payId,lendId,paymentAmount,paymentDescription,DATE_FORMAT(paymentDate,"%Y-%m-%d") AS paymentDate,createdDate,updatedDate FROM paymenthistory WHERE userId = ? AND lendId = ? AND status=1`,
    // get the payment details related to the borrow
    getBorrowPaymentDetailsQuery: `SELECT payId,borrowId,paymentAmount,paymentDescription,DATE_FORMAT(paymentDate,"%Y-%m-%d") AS paymentDate,createdDate,updatedDate FROM paymenthistory WHERE userId = ? AND borrowId = ? AND status=1`,
    // paymentstatus of lending data
    statusLendingPaymentQuery: 'SELECT paymentStatus from lendigdata WHERE userId=? AND lendId=? and status=1',
    // paymentstatus of borrow data
    statusBorrowPaymentQuery: 'SELECT paymentStatus from borrowingdata WHERE userId=? AND borrowId=? and status=1',
    // delete payment details
    deletePaymentQuery: 'UPDATE paymenthistory SET status=0,updatedDate=? WHERE payId=?',

    // get tital users Count
    totalUsersQuery: 'SELECT COUNT(userId) AS totalUsers FROM users WHERE status=1',


    // chart queries
    // year data query
    // credit chart
    yearCreditChartQuery: `select year(creditDate) as year, SUM(creditAmount) as totalAmount from creditdata 
    where userId = ? AND status=1 group by year(creditDate) order by year ASC`,
    // debit chart
    yearDebitChartQuery: `select year(debitDate) as year, SUM(debitAmount) as totalAmount from debitdata
    where userId = ? AND status=1 group by year(debitDate) order by year ASC`,
    // lending chart
    yearLendingChartQuery: `select year(lendingDate) as year, SUM(lendingAmount) as totalAmount from lendigdata
    where userId = ? AND status=1 group by year(lendingDate) order by year ASC`,

    // month data query
    // credit chart
    monthCreditChartQuery: `select monthname(creditDate) as month, SUM(creditAmount) as totalAmount from creditdata c 
    where userId=? and year(creditDate)=? AND status=1 group by monthname(creditDate) order by month ASC `,
    monthDebitChartQuery: `select monthname(debitDate) as month, SUM(debitAmount) as totalAmount from debitdata 
    where userId = ? AND year(debitDate)=? AND status=1 group by monthname(debitDate) order by month ASC`,
    monthLendingChartQuery: `select monthname(lendingDate) as month, SUM(lendingAmount) as totalAmount from lendigdata 
    where userId = ? AND year(lendingDate)=? AND status=1 group by monthname(lendingDate) order by month ASC`,

}

module.exports = userQueries