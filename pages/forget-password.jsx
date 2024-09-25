// components/ForgetPassword.js

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Auth from "@/layouts/Auth";
import { callApi } from "@/utils/FetchApi";
import { useRouter } from "next/router";

const ForgetPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // Step 1: Initial form
  const [formData, setFormData] = useState({});
  const [userType, setUserType] = useState(null);
  const initialValues = {
    email: "",
    user_type: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchemaStep1 = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    user_type: Yup.string().required("Required"),
  });

  const validationSchemaStep3 = Yup.object().shape({
    otp: Yup.string().required("Required").min(6, "OTP must be 6 digits"),
    newPassword: Yup.string()
      .required("Required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Required"),
  });

  const handleSubmitStep1 = async (values) => {
    const data = await callApi("forgot-password", "POST", {
      email: values.email,
      user_type: values.user_type,
    });
    if (data.success) {
      setUserType(values.user_type);
      setFormData({
        ...formData,
        email: values.email,
        user_type: values.user_type,
      });
      alert(data.msg);
      setStep(2);
    } else {
      alert(data.msg);
    }
  };

  const handleSubmitStep3 = async (values) => {
    console.log(values);
    const data = await callApi("set-new-password", "POST", {
      ...formData,
      otp: values.otp,
      password: values.newPassword,
    });
    if (data.success) {
      alert(data.msg);
      router.push(`/auth/${userType}-login`);
    } else {
      alert(data.msg);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-4 py-4">
      <h2 className="text-lg font-semibold mb-4">Forgot Password</h2>
      {step === 1 && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemaStep1}
          onSubmit={handleSubmitStep1}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="user_type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User Type
                </label>
                <Field
                  as="select"
                  id="user_type"
                  name="user_type"
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select User Type</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="manager">Manager</option>
                </Field>
                <ErrorMessage
                  name="user_type"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      )}
      {step === 2 && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemaStep3}
          onSubmit={handleSubmitStep3}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter OTP
                </label>
                <Field
                  type="text"
                  id="otp"
                  name="otp"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <Field
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Password"}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

ForgetPassword.layout = Auth;
export default ForgetPassword;
