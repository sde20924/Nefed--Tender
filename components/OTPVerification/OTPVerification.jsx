import { useRouter } from "next/router";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { callApi } from "@/utils/FetchApi";

// Yup validation schema for OTP
const OTPVerificationSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be a 6-digit number")
    .required("OTP is required"),
});

const OTPVerification = ({ email, loginAs }) => {
  const router = useRouter();
  console.log(email);
  // Handle OTP submission
  const handleSubmit = async (values, { setSubmitting }) => {
    const otpData = await callApi("otp/verify", "POST", {
      email,
      otp: values.otp,
      login_as: loginAs,
    });
    console.log({ email, otp: values.otp, login_as: loginAs });

    console.log(otpData);
    if (otpData.success) {
      alert(otpData.msg);
      localStorage.setItem("token", otpData.token);
      if (otpData?.data?.status === "not_verified") {
        localStorage.setItem("openModal", 1);
      }
      localStorage.setItem("data", JSON.stringify(otpData));
      router.push("/dashboard");
    } else {
      alert(otpData.msg);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div className=" p-8 rounded max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          OTP Verification
        </h1>
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={OTPVerificationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Enter OTP
              </label>
              <Field
                id="otp"
                name="otp"
                type="text"
                className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                placeholder="6-digit OTP"
              />
              <ErrorMessage
                name="otp"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-black mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Verify OTP
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default OTPVerification;
