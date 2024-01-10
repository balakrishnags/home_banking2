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
          {/* <Route path={RouteStrings.envdata} element={<FileEnv />} /> */}
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
