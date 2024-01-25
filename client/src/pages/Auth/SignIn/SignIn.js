import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Input_element } from "../../../components/input_field/Input_element";
import { useDispatch } from "react-redux";
import { setAccessToken, setIsAuth, setLoggedInUser, setSnackbar } from "../../../store/reducers/ui.reducer";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import "./SignIn.scss";
import { PostRequestHook } from "../../../apis/Services";
import { configUrl } from "../../../apis/api.config";
import { SnackBar } from "../../../components/SnackBars/SnackBar";
import { RegEx } from "../../../utils/RegEx";
import { RouteStrings } from "../../../utils/common";
import { PasswordShowHide } from "../../../components/PasswordShow/PasswordShowHide";
import { useRef } from "react";
import { Images } from "../../../utils/images";


export const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isAdmin, setAdmin] = useState(false)

  const snackBarContent = (isSuccess, message) => {
    dispatch(setSnackbar({ isOpen: true, message: message, isSuccess: isSuccess }))
  }

  const { getRequest, postRequest } = PostRequestHook()

  const postSigninUpdate = async (url, data) => {
    var response = await postRequest(url, data)
    if (response?.status === 200) {
      snackBarContent(true, response?.data?.message)
      dispatch(setAccessToken(response?.data?.data?.token))
      dispatch(setIsAuth({
        isAuth: true,
        data: { email: response.data.data.email, role: response.data.data.roleId, userId: response.data.data.userId },
        refresh_token: response.data.data.refreshtoken
      }));
      navigate(RouteStrings.dashboard, { replace: true })
    } else if (response?.response?.data?.status === 401 || response?.response?.data?.status === 404) {
      snackBarContent(false, response?.response?.data?.message)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      let errors = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!RegEx.email__regEx.test(values.email)) {
        errors.email = "Enter Valid Email";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }
      return errors;
    },
    onSubmit: (values) => {
      let data = {
        email: values.email,
        password: values.password,
        isAdmin: isAdmin
      }

      postSigninUpdate(configUrl.login, data)
    },
  });

  const inputRef = useRef(null);
  const contentWidthRef = useRef(null);

  const [width, setWidth] = useState("0")
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const measureContentWidth = () => {
    if (contentWidthRef.current && inputRef.current) {
      contentWidthRef.current.textContent = formik.values.email || '';
      const contentWidth = contentWidthRef.current.offsetWidth;
      let widthPercentage = (contentWidth / inputRef.current.scrollWidth) * 100;
      widthPercentage = widthPercentage.toFixed(2);
      setWidth(widthPercentage)
    }
  };


  return (
    <>
      <div className="my-4 text-center">
        <h3 className="header_color">SignIn</h3>
      </div>

      <div className="formsignin_width">
        <div className="d-flex justify-content-around border_bot">
          <button className={` ${isAdmin ? "active_admin" : "border-0 bg-transparent text-light"}`} onClick={() => {
            setAdmin(true)
            formik.resetForm()
          }}><strong>Admin</strong> </button>
          <button className={`${isAdmin ? "border-0 bg-transparent text-light" : "active_admin"}`} onClick={() => {
            setAdmin(false)
            formik.resetForm()
          }}><strong>User</strong> </button>
        </div>

        <div className="my-4">
          <div className="circle">
            <div className="smallCircle left">
              <div className="position-relative h-100">
                <div className="blackcircle" style={{ transform: `translate(${!isFocused ? `-50%,-50%` : `${-100 + Number(width)}%,-15%`})` }}></div>
              </div>
            </div>
            <div className="smallCircle right">
              <div className="position-relative h-100">
                <div className="blackcircle" style={{ transform: `translate(${!isFocused ? `-50%,-50%` : `${-100 + Number(width)}%,-15%`})` }}></div>
              </div>
            </div>
            <div className="mouth">
              <img src={Number(width) > 0 ? Images.bigsmile : Images.smile} alt="smile" className={`img-fluid`} />
            </div>
            <div className={`blockBox blockbox_left ${isPasswordFocused ? "focus" : ""}`}><img src={Images.righthand} alt="hand" className="img-fluid" /></div>
            <div className={`blockBox blockbox_right ${isPasswordFocused ? "focus" : ""}`}><img src={Images.lefthand} alt="hand" className="img-fluid" /></div>
          </div>
        </div>
        <Form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label htmlFor="userInput" className="text-light mb-2">Email Address</label>
            <input type="email" name="email" id="userInput"
              className="form-control w-100"
              ref={inputRef}
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={(e) => {
                formik.handleBlur(e)
                setIsFocused(false)
              }}
              onKeyDown={measureContentWidth}
              onFocus={() => setIsFocused(true)}
              placeholder="Enter Email Address"
            />
            <div ref={contentWidthRef} style={{ position: 'absolute', visibility: 'hidden', wordBreak: 'break-word' }}></div>

            {formik.touched.email && formik.errors.email ? (
              <>
                <span className="text-danger small">{formik.errors.email}</span>
              </>
            ) : null}
          </div>
          {/* <Input_element
            name="email"
            input_label="Email Address"
            type="email"
            lableClass="font_color"
            handleChange={formik.handleChange}
            value={formik.values.email}
            handleBlur={formik.handleBlur}
            placeholder="Enter Email Address"
            formikValidation={formik.touched.email && formik.errors.email ? (
              <>
                <span className="text-danger small">{formik.errors.email}</span>
              </>
            ) : null}
          /> */}


          <PasswordShowHide
            name="password"
            input_label="Password"
            lableClass="font_color"
            placeholder="Enter Valid Password"
            handleChange={formik.handleChange}
            handleBlur={(e) => {
              formik.handleBlur(e)
              setIsPasswordFocused(false)
            }}
            value={formik.values.password}
            handleFocus={() => setIsPasswordFocused(true)}
            formikValidation={formik.touched.password && formik.errors.password ? (
              <>
                <span className="text-danger small">{formik.errors.password}</span>
              </>
            ) : null}
          />

          <Button type="submit" className="btn_submit">
            LOGIN
          </Button>
        </Form>
        <div className="text-end mt-3">
          <Link to={RouteStrings.forgotpassword} className="forgot_link text-decoration-underline">
            {isAdmin ? "Forgot Password" : "Request Forget Password"}
          </Link>
        </div>
      </div>
    </>
  );
};
