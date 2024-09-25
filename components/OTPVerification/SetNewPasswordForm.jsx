// components/SetNewPasswordForm.js

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { callApi } from "@/utils/FetchApi";

const SetNewPasswordForm = ({ data, closeSetPass }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [signInDisabled, setSignInDisabled] = useState(false);
  const formik = useFormik({
    initialValues: {
      newPassword: "", // Renamed for uniqueness
      confirmNewPassword: "", // Renamed for uniqueness
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      console.log({ ...values, ...data });
      setTimeout(() => {
        setSignInDisabled(true);
      }, 200);
      const resData = await callApi("set-new-password", "POST", {
        ...data,
        password: values.newPassword,
      });
      if (resData.success) {
        setSignInDisabled(false);
        alert(resData.msg);
        closeSetPass();
      } else {
        setSignInDisabled(false);
        alert(resData.msg);
      }
    },
  });

  return (
    <div className="flex items-center justify-center bg-gray-100 shadow-lg rounded-lg">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Set New Password
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="newPassword" // Ensure unique ID
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("newPassword")}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </div>
            </div>
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <p className="mt-2 text-sm text-red-600">
                {formik.errors.newPassword}
              </p>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                id="confirmNewPassword" // Ensure unique ID
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("confirmNewPassword")}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${
                  formik.touched.confirmNewPassword &&
                  formik.errors.confirmNewPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </div>
            </div>
            {formik.touched.confirmNewPassword &&
            formik.errors.confirmNewPassword ? (
              <p className="mt-2 text-sm text-red-600">
                {formik.errors.confirmNewPassword}
              </p>
            ) : null}
          </div>

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
              SET NEW PASSWORD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetNewPasswordForm;
