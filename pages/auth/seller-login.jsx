import React, { useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// layout for page
import Auth from "@/layouts/Auth";
import { useRouter } from "next/router";
import { callApi } from "@/utils/FetchApi";
import SetNewPasswordForm from "@/components/OTPVerification/SetNewPasswordForm";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(16, "Password can't exceed 16 characters")
    .required("Password is required"),
});

export default function Login() {
  const [otpSec, setOtpSec] = useState("none");
  const [signInDisabled, setSignInDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loginHidden, setLoginHidden] = useState(false);
  const [dataForsetPass, setDataForSetPass] = useState({});

  const router = useRouter();
  const initialValues = {
    email: "",
    password: "",
  };

  const setLoginHiddenStatus = () => {
    setLoginHidden(false);
  };

  const handleSubmit = async (values) => {
    setSignInDisabled(true);

    const data = await callApi("seller/login", "POST", { ...values });

    if (!data.success) {
      if (data.errors) {
        setSignInDisabled(false);
        alert(data.errors[0].msg);
      } else if (data["is_email_verified"] !== undefined) {
        setSignInDisabled(false);
        alert(data.msg);
        const otpData = await callApi("otp/resend", "POST", {
          email: values.email,
        });

        if (otpData.success) {
          setEmail(values.email);
          setTimeout(() => {
            setSignInDisabled(true);
          }, 200);
          setOtpSec("initial");
        } else {
          setSignInDisabled(false);
          alert(otpData.msg);
        }
      } else if (data["temp_pass_verified"] !== undefined) {
        setDataForSetPass({
          ...dataForsetPass,
          email: values.email,
          temp_password: values.password,
          user_type: "seller",
        });
        setSignInDisabled(false);
        alert(data.msg);
        setLoginHidden(true);
      } else {
        setSignInDisabled(false);
        alert(data.msg);
      }
    }
    // if user is not verfied

    if (data.success) {
      localStorage.setItem("token", data.token);
      if (data.data?.status === "not_verified") {
        localStorage.setItem("openModal", 1);
      }
      localStorage.setItem("data", JSON.stringify(data));
      alert(data.msg);
      router.push("/dashboard");
    }
  };

  const verifyOtp = async () => {
    const otpData = await callApi("otp/verify", "POST", { email, otp });
    if (otpData.success) {
      setSignInDisabled(false);
      alert(otpData.msg);
    } else {
      alert(otpData.msg);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div
          style={{ gap: "24px" }}
          className="flex justify-between flex-wrap h-full"
        >
          <div className="lg:w-4/12 px-4">
            <h1 style={{ fontSize: "32px", color: "orangered" }}>
              Welcome to the eAuction Login Portal{" "}
              <span style={{ color: "green" }}>Seller</span>
            </h1>
            <p style={{ fontSize: "18px", color: "white", marginTop: "16px" }}>
              Sign in to manage your listings, track bids, and engage with a
              diverse audience. Our platform provides robust tools for creating
              compelling product descriptions, setting reserve prices, and
              analyzing market trends to help you achieve the best possible
              sales outcomes.
            </p>
          </div>
          <div
            className={`${
              !loginHidden ? "hidden" : "initial"
            } w-full lg:w-4/12 px-4`}
          >
            <SetNewPasswordForm
              data={dataForsetPass}
              closeSetPass={setLoginHiddenStatus}
            />
          </div>
          <div
            className={`${
              loginHidden ? "hidden" : "initial"
            } w-full lg:w-4/12 px-4`}
          >
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 mt-3 font-bold">
                  <small>Login as seller</small>
                </div>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ setFieldValue }) => (
                    <Form>
                      {/* Email */}
                      <div className="relative w-full mb-3">
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

                      <div style={{ display: otpSec }}>
                        <label
                          htmlFor="otp"
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        >
                          Enter OTP
                        </label>
                        <input
                          id="otp"
                          name="otp"
                          contentEditable={!signInDisabled}
                          type="text"
                          onChange={(e) => setOtp(e.target.value)}
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="6-digit OTP"
                        />

                        <button
                          disabled={!signInDisabled}
                          onClick={verifyOtp}
                          type="button"
                          className={`${
                            signInDisabled ? "bg-black" : "bg-teal-500"
                          } mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                        >
                          {signInDisabled ? "Verify OTP" : "Verified"}
                        </button>
                      </div>

                      {/* Submit Button */}
                      <div className="text-center mt-6">
                        <button
                          style={{
                            cursor: signInDisabled ? "not-allowed" : "pointer",
                          }}
                          disabled={signInDisabled}
                          type="submit"
                          className={`${
                            signInDisabled ? "bg-gray-500" : "bg-blueGray-800"
                          } text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150`}
                        >
                          SIGN IN
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <Link href="/forget-password" className="text-blueGray-200">
                  <small>Forgot password?</small>
                </Link>
              </div>
              <div className="w-1/2 text-right">
                <Link
                  href="/auth/seller-register"
                  className="text-blueGray-200"
                >
                  <small>Create new account</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Login.layout = Auth;
