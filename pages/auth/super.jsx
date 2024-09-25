import React, { useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import Admin from "@/layouts/Admin";
import { useRouter } from "next/router";
import { callApi } from "@/utils/FetchApi";

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

export default function SuperAdmin() {
  const router = useRouter();
  const [signInDisabled, setSignInDisabled] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    setSignInDisabled(true);

    const data = await callApi("admin/login", "POST", { ...values });
    if (!data.success) {
      if (data.errors) {
        setSignInDisabled(false);
        alert(data.errors[0].msg);
      } else {
        setSignInDisabled(false);
        alert(data.msg);
      }
    }

    console.log(data);
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("data", JSON.stringify(data));
      alert(data.msg);
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="w-full flex px-4 h-full"
      >
        <div style={{ maxWidth: "450px", width: "100%" }} className="px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="flex-auto mt-8 px-4 lg:px-10 py-10 pt-0">
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
          <div className="flex justify-end flex-wrap mt-6 relative">
            <div>
              <Link
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                className="text-blueGray-200"
              >
                <small>Forgot password?</small>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

SuperAdmin.layout = Admin;
