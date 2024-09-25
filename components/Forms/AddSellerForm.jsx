import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { callApi } from "@/utils/FetchApi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { addSeller } from "@/store/slices/sellerSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllApprovedSellers } from "@/utils/getData";

const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(3, "First name must be at least 3 characters")
    .max(30, "First name can't exceed 30 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(3, "Last Name must be at least 3 characters")
    .max(30, "Last Name can't exceed 30 characters")
    .required("Last Name is required"),
  company_name: Yup.string()
    .min(3, "Company Name must be at least 3 characters")
    .max(60, "Company Name can't exceed 60 characters")
    .required("Company Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone_number: Yup.string()
    .min(10, "Contact must be 10 digit")
    .max(10, "Contact can't exceed 10 digit")
    .required("Contact is required"),
  gst_number: Yup.string()
    .matches(
      /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})?$/,
      "Invalid GST number"
    )
    .required("GST number is required"),
  // pan_number: Yup.string()
  //   .matches(
  //     /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  //     "PAN must be 10 characters long, starting with 5 letters, followed by 4 digits and ending with 1 letter"
  //   )
  //   .required("PAN is required"),
  // adhaar_number: Yup.string()
  //   .required("Aadhaar Number is required")
  //   .matches(/^\d{12}$/, "Aadhaar Number must be exactly 12 digits"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(16, "Password can't exceed 16 characters")
    .required("Password is required"),
});

const AddSellerForm = () => {
  const [signInDisabled, setSignInDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.sellers);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      company_name: "",
      email: "",
      phone_number: "",
      gst_number: "",
      // pan_number: "",
      // adhaar_number: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setTimeout(() => {
        setSignInDisabled(true);
      }, 200);
      const currUserData = JSON.parse(localStorage.getItem("data"));
      const data = await callApi("seller/register", "POST", {
        ...values,
        created_by: currUserData.data.admin_id,
      });

      console.log(data);
      if (data.success) {
        if (!sellers) {
          getAllApprovedSellers(dispatch);
        }
        dispatch(addSeller(data.userDetails));
        resetForm();
        setSignInDisabled(false);
        alert(data.msg);
      } else {
        if (data.errors) {
          setSignInDisabled(false);
          alert(data.errors[0].msg);
        } else {
          setSignInDisabled(false);
          alert(data.msg);
        }
      }
    },
  });

  function generatePassword() {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
    let password = "";
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  return (
    <div className="flex gap-4 flex-wrap lg:flex-nowrap p-4">
      <div className="w-full p-4 bg-white shadow-md rounded">
        <form onSubmit={formik.handleSubmit}>
          <h2 className="text-lg font-semibold mb-4">Personal Info</h2>
          <hr className="border-gray-300 mb-8" />
          <div className="flex justify-between mb-3">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.first_name}
                className={`mt-1 block w-full border ${
                  formik.touched.first_name && formik.errors.first_name
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {formik.touched.first_name && formik.errors.first_name ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.first_name}
                </div>
              ) : null}
            </div>
            <div className="w-full md:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.last_name}
                className={`mt-1 block w-full border ${
                  formik.touched.last_name && formik.errors.last_name
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {formik.touched.last_name && formik.errors.last_name ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.last_name}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-between mb-3">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`mt-1 block w-full border ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div className="w-full md:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="number"
                name="phone_number"
                placeholder="Contact Number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone_number}
                className={`mt-1 block w-full border ${
                  formik.touched.phone_number && formik.errors.phone_number
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {formik.touched.phone_number && formik.errors.phone_number ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.phone_number}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex justify-between mb-3">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-700">
                GST Number
              </label>
              <input
                type="text"
                name="gst_number"
                placeholder="GST Number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.gst_number}
                className={`mt-1 block w-full border ${
                  formik.touched.gst_number && formik.errors.gst_number
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {formik.touched.gst_number && formik.errors.gst_number ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.gst_number}
                </div>
              ) : null}
            </div>
            <div className="w-full md:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.company_name}
                className={`mt-1 block w-full border ${
                  formik.touched.company_name && formik.errors.company_name
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {formik.touched.company_name && formik.errors.company_name ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.company_name}
                </div>
              ) : null}
            </div>
            {/* <div className="w-full md:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700">
                PAN Number
              </label>
              <input
                type="text"
                name="pan_number"
                placeholder="PAN Number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.pan_number}
                className={`mt-1 block w-full border ${
                  formik.touched.pan_number && formik.errors.pan_number
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {formik.touched.pan_number && formik.errors.pan_number ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.pan_number}
                </div>
              ) : null}
            </div> */}
          </div>

          <div className="flex justify-between mb-3">
            {/* <div className="w-full md:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700">
                Aadhar Number
              </label>
              <input
                type="text"
                name="adhaar_number"
                placeholder="Aadhar Number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adhaar_number}
                className={`mt-1 block w-full border ${
                  formik.touched.adhaar_number && formik.errors.adhaar_number
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {formik.touched.adhaar_number && formik.errors.adhaar_number ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.adhaar_number}
                </div>
              ) : null}
            </div> */}
          </div>
        </form>
      </div>
      <div className="max-w-full lg:max-w-screen-sm w-full p-4 bg-white shadow-md rounded">
        <form onSubmit={formik.handleSubmit}>
          <h2 className="text-lg font-semibold mb-4">Password & Security</h2>
          <hr className="border-gray-300 mb-8" />
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={() =>
                formik.setFieldValue("password", generatePassword())
              }
              className="text-blue-600 hover:text-blue-800"
            >
              Generate Password
            </button>
          </div>

          <div className="w-full px-2 mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              Set Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Set Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`mt-1 block w-full border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm pr-10`}
              />
              <div
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="text-gray-500" />
                ) : (
                  <AiFillEye className="text-gray-500" />
                )}
              </div>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          {/* <div className="flex gap-4 px-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="sendMail"
                onChange={formik.handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                Send Mail
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="verifyEmail"
                onChange={formik.handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                Verify E-Mail
              </label>
            </div>
          </div> */}

          <div
            className="flex w-full justify-end mt-4"
            style={{
              cursor: signInDisabled ? "not-allowed" : "pointer",
            }}
            disabled={signInDisabled}
          >
            <button
              type="submit"
              className={`${
                signInDisabled ? "bg-gray-500" : "bg-blueGray-800"
              } text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
            >
              Create Seller
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSellerForm;
