import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "tailwindcss/tailwind.css";
import UserDashboard from "@/layouts/UserDashboard";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import withAdminAuth from "@/components/CheckAuth/AdminRoutes";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";

import {
  getProfileData,
  updateMSG,
  updateProfile,
} from "@/store/slices/profileSlice";

function ProfilePage() {
  const [isEditable, setIsEditable] = useState(false);

  const dispatch = useDispatch();
  const { profileData, profileLoading, p_msg } = useSelector(
    (state) => state.profileData
  );

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(30, "Name can't exceed 30 characters")
      .required("Name is required"),
    lastName: Yup.string()
      .min(3, "Last Name must be at least 3 characters")
      .max(30, "Last Name can't exceed 30 characters")
      .required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .min(10, "Contact must be 10 characters")
      .max(10, "Contact can't exceed 10 characters")
      .required("Phone is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsEditable(false);
      dispatch(
        updateProfile({
          first_name: values.name,
          last_name: values.lastName,
          email: values.email,
          phone_number: values.phone,
        })
      );
    },
  });

  const setFormikValues = () => {
    formik.setValues({
      name: profileData.first_name,
      lastName: profileData.last_name,
      email: profileData.email,
      phone: profileData.phone_number,
    });
  };

  const getUserInfo = () => {
    if (profileData) {
      setFormikValues();
    } else {
      dispatch(getProfileData());
    }
  };

  useEffect(() => {
    if (p_msg) {
      setFormikValues();
      alert(p_msg);
      dispatch(updateMSG());
    }
  }, [p_msg]);

  useEffect(() => {
    getUserInfo();
  }, [profileData]);

  if (profileLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <main>
        <HeaderTitle
          padding={"p-4"}
          title={"Profile Page"}
          subTitle={"View personal info & update info"}
        />

        <div className="w-full p-4">
          <div className="w-full flex justify-center bg-white shadow-md rounded p-4">
            <div className="w-full max-w-screen-md">
              <div className="flex justify-center">
                <img
                  src="/img/team-1-800x800.jpg"
                  alt="Profile"
                  className="max-w-40 rounded-full"
                />
              </div>

              {/*  FORM SECTION */}
              <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {/* Name Field */}
                  <div className="flex flex-col">
                    <label htmlFor="name" className="block mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      disabled={!isEditable}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full p-2 border rounded-xl ${
                        formik.touched.name && formik.errors.name
                          ? "border-red-500"
                          : isEditable
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>

                  {/* Last Name Field */}
                  <div className="flex flex-col">
                    <label htmlFor="lastName" className="block mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      disabled={!isEditable}
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full p-2 border rounded-xl ${
                        formik.touched.lastName && formik.errors.lastName
                          ? "border-red-500"
                          : isEditable
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.lastName}
                      </div>
                    ) : null}
                  </div>

                  {/* Phone Field */}
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="block mb-1">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="text"
                      name="phone"
                      disabled={!isEditable}
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full p-2 border rounded-xl ${
                        formik.touched.phone && formik.errors.phone
                          ? "border-red-500"
                          : isEditable
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.phone}
                      </div>
                    ) : null}
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col">
                    <label htmlFor="email" className="block mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      disabled={!isEditable}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full p-2 border rounded-xl ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500"
                          : isEditable
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditable(true)}
                    className="py-2 px-4 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit Info
                  </button>
                  <button
                    type="submit"
                    disabled={!isEditable}
                    className={`py-2 px-4 ${
                      isEditable ? "bg-green-500" : "bg-gray-300"
                    } text-white rounded`}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
ProfilePage.layout = UserDashboard;
export default withAdminAuth(ProfilePage);
