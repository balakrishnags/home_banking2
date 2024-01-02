import React, { useState } from "react";
import { Outlet, Route, Routes, Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "../pages/Dashboard/Dashboard";
import { SignIn } from "../pages/Auth/SignIn/SignIn";
import { SignUp } from "../pages/Auth/SignUp/SignUp";
import { ForgotPassword } from "../pages/Auth/ForgotPassword/ForgotPassword";
import { ResetPassword } from "../pages/Auth/ResetPassword/ResetPassword";
import { RouteStrings } from "../utils/common";
import { NotFoundScreen } from "../pages/404/404";
import { Dashboard2 } from "../pages/Dashboard/Dashboard2";
import { IsAuthcondition } from "./IsAuthcondition";
import { Users } from "../pages/Users/Users";
import { UserPassword } from "../pages/Users/UserPassword";
import { UserProfile } from "../components/UserProfile/UserProfile";
import { CreditScreen } from "../pages/Credit/CreditScreen";
import { DebitList } from "../pages/Debit/DebitList";
import { LendingList } from "../pages/Lending/LendingList";
import { SampleCreditList } from "../pages/Credit/SampleCreditList";
import { FileEnv } from "../pages/EnvFile/FileEnv";
import { Borrow } from "../pages/Borrow/Borrow";

const RouteCheck = () => {
  const { userInfo, auth: { isAuth } } = useSelector((state) => state.UIStore);
  // console.log("🚀 ~ file: RouteCheck.js:23 ~ RouteCheck ~ isAuth:", isAuth)


  return (
    <>
      <Routes>
        <Route path={isAuth ? RouteStrings.dashboard : RouteStrings.login} element={<SignIn />} />
        <Route path={isAuth ? RouteStrings.dashboard : RouteStrings.signup} element={<SignUp />} />
        <Route path={isAuth ? RouteStrings.dashboard : RouteStrings.forgotpassword} element={<ForgotPassword />} />
        <Route path={isAuth ? RouteStrings.dashboard : RouteStrings.resetpassword} element={<ResetPassword />} />

        <Route path={RouteStrings.dashboard} element={<Dashboard />}>
          <Route index element={<Dashboard2 />} />
          <Route path={RouteStrings.users} element={<Users />} />
          <Route path={RouteStrings.userpassword} element={<UserPassword />} />
          <Route path={RouteStrings.creditlist} element={<CreditScreen />} />
          <Route path={RouteStrings.debitlist} element={<DebitList />} />
          <Route path={RouteStrings.lendinglist} element={<LendingList />} />
          <Route path={RouteStrings.borrowedlist} element={<Borrow />} />
          <Route path={RouteStrings.userCreditlist} element={<SampleCreditList />} />
          <Route path={RouteStrings.envdata} element={<FileEnv />} />
          {/* {menuPermissions && <>
          {(role === "super_admin" || role === "hr" || menuPermissions.includes("Employee-module")) ? <>
            <Route path={RouteStrings.createEmployee} element={<CreateUser />} />
            <Route
              path={RouteStrings.udpateEmployeeDependants}
              element={<UpdateEmployeeDependants />}
            />
          </> : null}


          {(role === "super_admin" || role === "hr" || menuPermissions.includes("Leave-approval")) ? <>
            <Route path={RouteStrings.leaves} element={<Leaves />} /> </> : null}
          {menuPermissions.includes("Inventory-module") ?
            <>
              <Route path={RouteStrings.inventoryDashboard} element={<InventoryDashboard />} />
              <Route path={RouteStrings.inventoryBilling} element={<InventoryBilling />} />
              <Route path={RouteStrings.stockentry} element={<StockEntry />} />
              <Route path={RouteStrings.stockassign} element={<StockAssign />} />
              <Route path={RouteStrings.inventoryVendor} element={<InventoryVendor />} />
              <Route path={RouteStrings.inventoryProduct} element={<InventoryProduct />} />
              <Route path={RouteStrings.paymentMode} element={<PaymentMode />} />
              <Route path={RouteStrings.productStatus} element={<ProductStatus />} />
            </> : null}
          {menuPermissions.includes("Invoice-module") ?
            <>
              <Route path={RouteStrings.clientcontactlist} element={<AddClient />} />
              <Route path={RouteStrings.invoicelist} element={<CreateInvoice />} />
              <Route path={RouteStrings.companydetails} element={<CompanyDetails />} />
              <Route path={RouteStrings.billingdata} element={<BillingCrud />} />
              <Route path={RouteStrings.paymenttype} element={<PaymentCrud />} />
              <Route path={RouteStrings.additionalaccountsdetails} element={<AdditionalAccountDetails />} />
            </> : null}
          {(role === "super_admin" || role === "hr" || menuPermissions.includes("Settings")) ?
            <>
              <Route path={RouteStrings.createrole} element={<CreateRole />} />
              <Route path={RouteStrings.payslips} element={<Payslips />} />
              <Route path={RouteStrings.fields} element={<Fields />} />
              <Route path={RouteStrings.createshift} element={<CreateShift />} />
              <Route path={RouteStrings.employeetype} element={<EmployeeType />} />
              <Route path={RouteStrings.leavetype} element={<LeaveType />} />
              <Route path={RouteStrings.assignLevels} element={<AssignLevels />} />
              <Route path={RouteStrings.department} element={<DepartmentCrud />} />
              <Route path={RouteStrings.designation} element={<DesignationCrud />} />
              <Route path={RouteStrings.financialyear} element={<FinancialYear />} />
            </> : null}

        </>}

        <Route path={RouteStrings.adminLeaveCount} element={<AdminLeaveCount />} />

      <Route path={RouteStrings.organisationtree} element={<OrganisationTeam />} /> */}
          <Route
            path={RouteStrings.userprofile}
            element={<UserProfile />}
          />
          <Route path={RouteStrings[404]} element={<NotFoundScreen />} />
        </Route>
      </Routes >
    </>
  );
};

export default RouteCheck;
