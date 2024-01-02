import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Input_element } from "../../../components/input_field/Input_element";
import { ModalComponent } from "../../../components/modal/ModalComponent";
import { useFormik } from "formik";
import "./SignUp.scss";
import { PostRequestHook } from "../../../apis/Services";
import { configUrl } from "../../../apis/api.config";
import { RegEx } from "../../../utils/RegEx";
import { PasswordShowHide } from "../../../components/PasswordShow/PasswordShowHide";
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../../store/reducers/ui.reducer";

export const SignUp = () => {
  const [isCreated, setIsCreated] = useState(false)
  const { getRequest, postRequest } = PostRequestHook()

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const snackBarContent = (isSuccess, message) => {
    dispatch(setSnackbar({ isOpen: true, message: message, isSuccess: isSuccess }))
  }
  const handleCreatedmodal = () => {
    setIsCreated(false)
    navigate("/login")
  }

  const formik = useFormik({
    initialValues: {
      fullName: "",
      organizationName: "",
      email: "",
      phone: "",
      // privacy_terms: false,
      title: "",
      password: "",
      confirm_password: "",
    },
    validate: (values) => {
      let errors = {};

      if (!values.fullName) {
        errors.fullName = "Required Full Name";
      } else if (!RegEx.name__regEx.test(values.fullName)) {
        errors.fullName = "Alphabets Only";
      }
      if (!values.organizationName) {
        errors.organizationName = "Required Oraganization Name";
      }
      if (!values.email) {
        errors.email = "Required Work Email";
      } else if (!RegEx.email__regEx.test(values.email)) {
        errors.email = "Enter Valid Email";
      }
      if (!values.phone) {
        errors.phone = "Required Phone Number";
      } else if (!RegEx.only__number__regEx.test(values.phone)) {
        errors.phone = "Numbers only";
      }
      // if (values.privacy_terms == false) {
      //   errors.privacy_terms = "Accept the privacy policy";
      // }
      if (!values.title) {
        errors.title = "Required Title";
      }
      if (!values.password) {
        errors.password = "Required Password";
      } else if (!RegEx.password__regEx.test(values.password)) {
        errors.password = "Must Contain min 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Character";
      }

      if (!values.confirm_password) {
        errors.confirm_password = "must match with Password";
      } else if (values.confirm_password != values.password) {
        errors.confirm_password = "must match with Password";
      }

      return errors;
    },
    onSubmit: async (values) => {
      let data = {
        full_name: values.fullName,
        organization_name: values.organizationName.trim(),
        work_email: values.email,
        phone_number: (values.phone).toString(),
        your_title: Number(values.title),
        password: values.password
      }
      var response = await postRequest(configUrl.signup, data)
      if (response.status == 201) {
        snackBarContent(true, response.data.message)
        setIsCreated(true)
      } else if (response.response.data.status == 409 || response.response.data.status == 400) {
        snackBarContent(false, response.response.data.message)
      }
    },
  });

  return (
    <>
      <div className="my-4 text-center">
        <h3 className="header_color">SignUp</h3>
      </div>
      <div className="form_width">
        <Form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Input_element
                input_label="Full Name"
                type="text"
                lableClass="font_color"
                name="fullName"
                handleChange={formik.handleChange}
                value={formik.values.fullName}
                handleBlur={formik.handleBlur}
                placeholder="Enter Full Name"
                formikValidation={formik.touched.fullName && formik.errors.fullName ? (
                  <>
                    <span className="text-danger small">
                      {formik.errors.fullName}
                    </span>
                  </>
                ) : null}
              />
            </div>
            <div className="col-md-6">
              <Input_element
                input_label="Organization Name"
                type="text"
                lableClass="font_color"
                name="organizationName"
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.organizationName}
                placeholder="Enter Organization Name"
                formikValidation={formik.touched.organizationName && formik.errors.organizationName ? (
                  <>
                    <span className="text-danger small">
                      {formik.errors.organizationName}
                    </span>
                  </>
                ) : null}
              />
            </div>
            <div className="col-md-6">
              <Input_element
                input_label="Work Email Address"
                type="email"
                lableClass="font_color"
                name="email"
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder="Enter Work Email Address"
                formikValidation={formik.touched.email && formik.errors.email ? (
                  <>
                    <span className="text-danger small">{formik.errors.email}</span>
                  </>
                ) : null}
              />
            </div>
            <div className="col-md-6">
              <Input_element
                input_label="Phone Number"
                type="text"
                lableClass="font_color"
                name="phone"
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.phone}
                placeholder="Enter phone number"
                formikValidation={formik.touched.phone && formik.errors.phone ? (
                  <>
                    <span className="text-danger small">{formik.errors.phone}</span>
                  </>
                ) : null}
              />
            </div>
            {/* <div className="col-md-6">
              <Selectelement
                select_Label="Your Title"
                lableClass="font_color"
                name="title"
                handleBlur={formik.handleBlur}
                handleChange={formik.handleChange}
                value={formik.values.title}
                optionArray={designation.map((value, i) => {
                  return (
                    <option key={value.id} value={value.id}>
                      {value.name}
                    </option>
                  );
                })}
                formikValidation={formik.touched.title && formik.errors.title ? (
                  <>
                    <span className="text-danger small">{formik.errors.title}</span>
                  </>
                ) : null}
              />
            </div> */}
            <div className="col-md-6">
              <PasswordShowHide
                input_label="Password"
                lableClass="font_color"
                name="password"
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder="Enter Password"
                formikValidation={formik.touched.password && formik.errors.password ? (
                  <>
                    <span className="text-danger small">
                      {formik.errors.password}
                    </span>
                  </>
                ) : null}
              />
            </div>
            <div className="col-md-6">
              <PasswordShowHide
                input_label="Confirm Password"
                lableClass="font_color"
                name="confirm_password"
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.confirm_password}
                placeholder="Enter Password"
                formikValidation={formik.touched.confirm_password && formik.errors.confirm_password ? (
                  <>
                    <span className="text-danger small">
                      {formik.errors.confirm_password}
                    </span>
                  </>
                ) : null}
              />
            </div>
          </div>


          <div className="text-end">
            <Button type="submit" className="btn_submit">
              Submit form
            </Button>
          </div>
        </Form>
        <hr />
        <div className="text-end">
          <p className="font_color m-0">
            Already have an account with us?
            <Link to="/login" className="login_link ms-1">
              Login
            </Link>
          </p>
        </div>
      </div>

      <ModalComponent
        show={isCreated}
        onHide={handleCreatedmodal}
        modal_header={<><h3>Registered Successfully</h3></>}
        modal_body={<>
          <h4 className="text-center font_color">Account Created Successfully</h4>
          <div className="text-end">
            <p className="font_color m-0">
              Back to
              <Link to="/login" className="login_link ms-2 text-light">
                Login
              </Link>
            </p>
          </div>
        </>}
      />
    </>
  );
};
