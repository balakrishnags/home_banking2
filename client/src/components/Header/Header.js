import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { resetAuth, setViewSidebar } from "../../store/reducers/ui.reducer";
import "./header.scss";
import { Images } from "../../utils/images";
import { RouteStrings } from "../../utils/common";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";

export const Header = () => {
  const { auth: { isAuth }, isSidebarOpen, userInfo, orgName } = useSelector((state) => state.UIStore);
  // let role = userInfo ? (userInfo.role).trim().replace(/\s+/g, "_").toLowerCase() : null
  // var organization_name = userInfo ? userInfo.organization_name : null
  // let userName = userInfo ? userInfo.full_name : null
  // var adminId = userInfo ? userInfo.emp_id : null

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const buttonRef = useRef();

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 768;

  const [dropdown, setDropdown] = useState(false)

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const logout = () => {
    setDropdown(false)
    dispatch(resetAuth());
    navigate("/login")
  };
  const handleSidebar = () => {
    dispatch(setViewSidebar(!isSidebarOpen));
    setDropdown(false)
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div>
      <Navbar className="header_style fixed-top">

        <Container fluid>
          <NavLink id="nav_logo" to={isAuth ? "/" : "/login"} className="d-flex align-items-center text-decoration-none">
            <img src={Images.logo} alt="logo" className="logostyle" />
            <span className="font_color db_logo ms-2 mb-0">Home Banking</span>
          </NavLink>
          {isAuth &&
            <div className="ms-auto d-flex">
              <div className="d-flex gap-2 align-items-center position-relative">
                {/* {width >= breakpoint &&
                  <p className="font_color m-0">{userName}</p>
                } */}
                <img src={Images.userIcon} onClick={() => {
                  setDropdown(!dropdown)
                  dispatch(setViewSidebar(false));
                }} className="user_logo" />
                <div>
                  <div ref={buttonRef} className={dropdown ? "d-flex" : "d-none"}>
                    <div id="basic-nav-dropdown" className="dprdwn">
                      <div>
                        <NavLink id="profile_link" className="prof_link" to={RouteStrings.userprofile} onClick={() => setDropdown(false)}>Profile</NavLink>
                        <p id="logout_link" className="prof_link" onClick={logout}>Logout</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="ms-auto align-items-center">
                  {width < breakpoint && (
                    <>
                      <div className="hamber_div">
                        <img
                          src={Images.hamburger}
                          className="img-fluid"
                          onClick={handleSidebar}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>}

        </Container>
      </Navbar>
    </div >
  );
};
