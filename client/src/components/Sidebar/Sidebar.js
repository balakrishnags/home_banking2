import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { RouteStrings } from "../../utils/common";
import "./Sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import { setViewSidebar, setScreenWidth } from "../../store/reducers/ui.reducer";
import Accordion from 'react-bootstrap/Accordion';

export const Sidebar = () => {
  const { isSidebarOpen, userInfo } = useSelector(state => state.UIStore)

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 768;
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setScreenWidth(window.innerWidth))
    const handleWindowResize = () => {
      setWidth(window.innerWidth)
      dispatch(setScreenWidth(window.innerWidth))
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const handleClickLink = () => {
    dispatch(setViewSidebar(!isSidebarOpen))
  }

  return (
    <div className={`sidebar ${isSidebarOpen ? width < breakpoint ? "mob" : "" : 'close'}`}>
      <div className="sidebar_options">
        <Accordion>
          <div>
            <NavLink id="navlink_1" to={RouteStrings.dashboard} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Dashboard
            </NavLink>
          </div>
          {userInfo?.role === 1 &&
            <Accordion.Item eventKey="1">
              <Accordion.Header>Users</Accordion.Header>
              <Accordion.Body>
                <div>
                  <NavLink id="navlink_2" to={RouteStrings.users} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Users List
                  </NavLink>
                </div>

                <div>
                  <NavLink id="navlink_3" to={RouteStrings.userpassword} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Password Request
                  </NavLink>
                </div>
              </Accordion.Body>
            </Accordion.Item>}
          <div>
            <NavLink id="navlink_4" to={RouteStrings.creditlist} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Credit
            </NavLink>
          </div>
          <div>
            <NavLink id="navlink_5" to={RouteStrings.debitlist} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Debit
            </NavLink>
          </div>
          <div>
            <NavLink id="navlink_6" to={RouteStrings.lendinglist} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Lending
            </NavLink>
          </div>
          <div>
            <NavLink id="navlink_6" to={RouteStrings.borrowedlist} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Borrow
            </NavLink>
          </div>
          <div>
            <NavLink id="navlink_6" to={RouteStrings.envdata} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Env Data
            </NavLink>
          </div>

          {/* {(role === "super_admin" || role === "hr" || menuPermissions.includes("Employee-module")) ? <>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Employees</Accordion.Header>
              <Accordion.Body>
                <div>
                  <NavLink id="navlink_2" to={RouteStrings.createEmployee} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Employees List
                  </NavLink>
                </div>
                <div>
                  <NavLink id="navlink_3" to={RouteStrings.udpateEmployeeDependants} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Update Employee Dependents
                  </NavLink>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </> : null}

          <Accordion.Item eventKey="1">
            <Accordion.Header>Leaves</Accordion.Header>
            <Accordion.Body>
              {(role === "super_admin" || role === "hr" || menuPermissions.includes("Leave-approval")) ? <>
                <div>
                  <NavLink id="navlink_4" to={RouteStrings.leaves} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Employee Leaves
                  </NavLink>
                </div>
              </> : null}

              <div>
                <NavLink id="navlink_5" to={RouteStrings.adminLeaveCount} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                  Apply Leave
                </NavLink>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          {menuPermissions.includes("Inventory-module") ? <>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Inventory</Accordion.Header>
              <Accordion.Body>
                <div>
                  <NavLink to={RouteStrings.inventoryDashboard} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Inventory Dashboard
                  </NavLink>
                </div>
                <div>
                  <NavLink to={RouteStrings.inventoryBilling} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Vendors Billing Form
                  </NavLink>
                </div>
                <div>
                  <NavLink to={RouteStrings.stockentry} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Stock List
                  </NavLink>
                </div>
                <div>
                  <NavLink to={RouteStrings.stockassign} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Assign Stock
                  </NavLink>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>Inventory Master Menu</Accordion.Header>
              <Accordion.Body>
                <div>
                  <NavLink to={RouteStrings.inventoryVendor} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Vendors
                  </NavLink>
                </div>
                <div>
                  <NavLink to={RouteStrings.inventoryProduct} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Product Category
                  </NavLink>
                </div>
                <div>
                  <NavLink to={RouteStrings.productStatus} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Product Status
                  </NavLink>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </> : null}

          {menuPermissions.includes("Invoice-module") ? <>
            <Accordion.Item eventKey="5">
              <Accordion.Header>Finance</Accordion.Header>
              <Accordion.Body>
                <div>
                  <NavLink id="navlink_13" to={RouteStrings.invoicelist} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    invoice
                  </NavLink>
                </div>
                <div>
                  <NavLink id="navlink_14" to={RouteStrings.clientcontactlist} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Client Management
                  </NavLink>
                </div>
                <NavLink id="navlink_15" to={RouteStrings.companydetails} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                  Company Profile
                </NavLink>
                <div>
                  <NavLink id="navlink_20" to={RouteStrings.billingdata} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Billing Type
                  </NavLink>
                </div>
                <div>
                  <NavLink id="navlink_21" to={RouteStrings.paymenttype} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Payment Method
                  </NavLink>
                </div>
                <div>
                  <NavLink id="navlink_21" to={RouteStrings.additionalaccountsdetails} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Additional Accounts Details
                  </NavLink>
                </div>
              </Accordion.Body>
            </Accordion.Item></> : null}

          {(role === "super_admin" || role === "hr" || menuPermissions.includes("Settings")) ? <>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Settings</Accordion.Header>
              <Accordion.Body>
                <div>
                  <NavLink id="navlink_6" to={RouteStrings.department} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Department
                  </NavLink>
                </div>
                <div>
                  <NavLink id="navlink_7" to={RouteStrings.designation} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Designation
                  </NavLink>
                </div>
                <div>
                  <NavLink id="navlink_8" to={RouteStrings.createrole} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Roles
                  </NavLink>
                </div>
                <div>
                  <NavLink id="navlink_9" to={RouteStrings.createshift} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Shifts
                  </NavLink>
                </div>
                <div>
                  <NavLink id="navlink_10" to={RouteStrings.employeetype} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Employee Type
                  </NavLink>
                </div>
                <div>
                  <NavLink id="navlink_11" to={RouteStrings.leavetype} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Leave Type
                  </NavLink>
                </div>
                <div>
                  <NavLink id="navlink_12" to={RouteStrings.financialYear} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Financial Year
                  </NavLink>
                </div>
                <div>

                </div>
              </Accordion.Body>
            </Accordion.Item>
          </> : null}

          <div>
            <NavLink id="navlink_12" to={RouteStrings.organisationtree} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Organization Tree
            </NavLink>
          </div> */}
        </Accordion>

      </div>
    </div >
  );
};
