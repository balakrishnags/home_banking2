import React from "react";
import "./404.scss";
import { Images } from "../../utils/images";
import { Link, Navigate } from "react-router-dom";
import { RouteStrings } from "../../utils/common";

export const NotFoundScreen = () => {
  return (
    <>
      {/* <div className="notfoundmaindiv">
        <div className="notfoundImagediv">
          <img src={Images.notFound} alt="" className="notfoundimage" />
        </div>
        <div className="text-center mt-3">
          <Link to={"/"} className="btn btn-success">Back to Dashboard</Link>
        </div>
      </div> */}
      <Navigate to={RouteStrings.dashboard} />
    </>
  );
};
