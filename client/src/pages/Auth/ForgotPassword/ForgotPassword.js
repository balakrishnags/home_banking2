import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Input_element } from "../../../components/input_field/Input_element";
import { useFormik } from "formik";
import "./ForgotPassword.scss";
import { PostRequestHook } from "../../../apis/Services";
import { configUrl } from "../../../apis/api.config";
import { RegEx } from "../../../utils/RegEx";
import { RouteStrings } from "../../../utils/common";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../../store/reducers/ui.reducer";

export const ForgotPassword = () => {
  const { postRequest } = PostRequestHook()
  const [isSent, setIsSent] = useState(false);
  const [isAdmin, setAdmin] = useState(true)


  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: (values) => {
      let errors = {};

      if (!values.email) {
        errors.email = "Required Email";
      } else if (!RegEx.email__regEx.test(values.email)) {
        errors.email = "Enter Valid Email";
      }

      return errors;
    },
    onSubmit: async (values) => {
      var response = await postRequest(configUrl.forgotpassword, values)
      if (response.status == 200) {
        if (response?.data?.data?.roleId) {
          setAdmin(false)
        }
        setIsSent(true)
      } else if (response?.response?.data?.status == 404) {
        dispatch(setSnackbar({ isOpen: true, message: response.response.data.message, isSuccess: false }))
      }
    },
  });


  return (
    <>
      {isSent ? (
        <>
          <div className="formforgot_width">
            <h6 className="font_color">
              {isAdmin ?
                "Please check your email. We have sent you a mail with reset instructions. Please check your spam if you do not see the email within a minute."
                : "Thank you for Request, When the password is changed, you will be notified by email."}
            </h6>
          </div>
        </>
      ) : (
        <>
          <div className="my-4 text-center">
            <h3 className="header_color">Forgot Password?</h3>
          </div>
          <div className="formsignin_width">
            <Form onSubmit={formik.handleSubmit}>
              <Input_element
                id="foergotemail"
                input_label="Email Address"
                type="email"
                lableClass="font_color"
                name="email"
                handleBlur={formik.handleBlur}
                handleChange={formik.handleChange}
                value={formik.values.email}
                placeholder="Enter Email Address"
                formikValidation={formik.touched.email && formik.errors.email ? (
                  <>
                    <small className="text-danger small">{formik.errors.email}</small>
                  </>
                ) : null}
              />

              <Button type="submit" className="btn_submit" id="resetbutton">
                Reset
              </Button>
            </Form>
            <div className="text-center mt-4">
              <p className="font_color m-0">
                Back to
                <Link to={"/login"} className="forgot_link ms-2 text-decoration-underline">
                  login
                </Link>
              </p>
            </div>
          </div>

        </>
      )}
    </>
  );
};
