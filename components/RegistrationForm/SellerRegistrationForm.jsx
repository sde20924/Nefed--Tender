import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Link from "next/link";
import OTPVerification from "../OTPVerification/OTPVerification";
import { callApi } from "@/utils/FetchApi";

// Validation schema

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name can't exceed 30 characters")
    .required("Name is required"),
  lastName: Yup.string()
    .min(3, "Last Name must be at least 3 characters")
    .max(30, "Last Name can't exceed 30 characters")
    .required("Last Name is required"),
  companyName: Yup.string()
    .min(3, "Company Name must be at least 3 characters")
    .max(60, "Company Name can't exceed 60 characters")
    .required("Company Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{11}$/, "Phone number must be exactly 10 digits")
    .required("Phone is required"),
  gstNo: Yup.string()
    .matches(
      /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})?$/,
      "Invalid GST number"
    )
    .required("GST number is required"),
  // pan: Yup.string()
  //   .matches(
  //     /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  //     "PAN must be 10 characters long, starting with 5 letters, followed by 4 digits and ending with 1 letter"
  //   )
  //   .required("PAN is required"),
  // adharNo: Yup.string()
  //   .required("Aadhaar Number is required")
  //   .matches(/^\d{12}$/, "Aadhaar Number must be exactly 12 digits"),
  registrationNo: Yup.string().optional(),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(16, "Password can't exceed 16 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  agree: Yup.boolean()
    .oneOf([true], "You must agree to the Privacy Policy")
    .required("You must agree to the Privacy Policy"),
});

const SellerRegistrationForm = () => {
  const [btnDisabled, setbtnDisabled] = useState(false);
  const [email, setEmail] = useState("");

  const [showOTP, setShowOTP] = useState(false);
  const initialValues = {
    name: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    gstNo: "",
    // pan: "",
    // adharNo: "",
    registrationNo: "",
    password: "",
    confirmPassword: "",
    agree: false,
  };

  const handleSubmit = async (values) => {
    console.log(values);
    setTimeout(() => {
      setbtnDisabled(true);
    }, 200);

    const obj = {
      first_name: values.name,
      last_name: values.lastName,
      company: values.companyName,
      // pan_number: values.pan,
      gst_number: values.gstNo,
      // adhaar_number: values.adharNo,
      email: values.email,
      phone_number: values.phone,
      password: values.password,
      user_role: "seller",
    };

    const data = await callApi("seller/register", "POST", obj);

    console.log(data);
    if (data.success) {
      setEmail(values.email);
      setbtnDisabled(false);
      alert(data.msg);
      setShowOTP(true);
    } else {
      if (data.errors) {
        setbtnDisabled(false);
        alert(data.errors[0].msg);
      } else {
        setbtnDisabled(false);
        alert(data.msg);
      }
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        {showOTP ? (
          <OTPVerification email={email} loginAs={"seller"} />
        ) : (
          <div className="text-blueGray-400 text-center mb-3 mt-3 font-bold">
            <small>Register as seller</small>
          </div>
        )}
        {!showOTP && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <div
                  className="flex justify-between mb-3"
                  style={{ gap: "8px" }}
                >
                  <div className="w-full lg:w-6/12 mb-3 lg:mb-0">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="name"
                    >
                      First Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="border-0 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="First Name"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div className="w-full lg:w-6/12">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <Field
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="border-0 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Last Name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
                {/* Company Name */}
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="companyName"
                  >
                    Company Name
                  </label>
                  <Field
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Company Name"
                  />
                  <ErrorMessage
                    name="companyName"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* Email and Phone */}
                <div
                  className="flex justify-between mb-3"
                  style={{ gap: "8px" }}
                >
                  <div className="w-full lg:w-6/12 mb-3 lg:mb-0">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="border-0 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div className="w-full lg:w-6/12">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="phone"
                    >
                      Phone
                    </label>
                    <PhoneInput
                      country={"in"}
                      value={initialValues.phone}
                      onChange={(phone) => setFieldValue("phone", phone)}
                      inputStyle={{
                        width: "100%",
                        height: "2.75rem",
                        border: "none",
                        backgroundColor: "white",
                        borderRadius: "0.25rem",
                        boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.1)",
                        outline: "none",
                        transition: "all 150ms ease-linear",
                        color: "#4a5568",
                      }}
                      enableSearch={true}
                      autoFormat={true}
                      inputClass="placeholder-blueGray-300 text-sm focus:outline-none focus:ring ease-linear transition-all duration-150"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
                {/* GST No and PAN */}
                <div
                  className="flex justify-between mb-3"
                  style={{ gap: "8px" }}
                >
                  <div className="w-full lg:w-6/12 mb-3 lg:mb-0">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="gstNo"
                    >
                      GST No
                    </label>
                    <Field
                      type="text"
                      name="gstNo"
                      id="gstNo"
                      className="border-0 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="GST No"
                    />
                    <ErrorMessage
                      name="gstNo"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div className="w-full lg:w-6/12">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="registrationNo"
                    >
                      Registration No (Optional)
                    </label>
                    <Field
                      type="text"
                      name="registrationNo"
                      id="registrationNo"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Registration No"
                    />
                    <ErrorMessage
                      name="registrationNo"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* <div className="w-full lg:w-6/12">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="pan"
                    >
                      PAN
                    </label>
                    <Field
                      type="text"
                      name="pan"
                      id="pan"
                      className="border-0 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="PAN"
                    />
                    <ErrorMessage
                      name="pan"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div> */}
                </div>
                {/* Adhar No */}
                {/* <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="adharNo"
                  >
                    Adhar Number
                  </label>
                  <Field
                    type="text"
                    name="adharNo"
                    id="adharNo"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Adhar Number"
                  />
                  <ErrorMessage
                    name="adharNo"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div> */}
                {/* Registration No */}

                {/* Password */}
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* Confirm Password */}
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                {/* Agree to Policy */}
                <div className="flex items-center mb-3">
                  <Field
                    type="checkbox"
                    name="agree"
                    id="agree"
                    className="form-checkbox border-0 rounded text-blueGray-600 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  />
                  <label
                    className="ml-2 block uppercase text-blueGray-600 text-xs font-bold"
                    htmlFor="agree"
                  >
                    I agree with the{" "}
                    <Link href="/privacy-policy">
                      {/* <a className="text-lightBlue-500">Privacy Policy</a> */}
                    </Link>
                  </label>
                </div>
                <ErrorMessage
                  name="agree"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
                {/* Submit Button */}
                <div className="text-center mt-6">
                  <button
                    style={{ cursor: btnDisabled ? "not-allowed" : "pointer" }}
                    disabled={btnDisabled}
                    type="submit"
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  >
                    {btnDisabled ? "Creating account..." : "Create Account"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default SellerRegistrationForm;
