import UserDashboard from "@/layouts/UserDashboard";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PermissionForm from "../../../components/Forms/PermissionsUIForm";
import { useRouter } from "next/router";
import DataNotAvailable from "@/components/DataNotAvailable/DataNotAvailable";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { callApi, callApiGet } from "@/utils/FetchApi";

const validationSchema = Yup.object({
  first_name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name can't exceed 30 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .min(3, "Last Name must be at least 3 characters")
    .max(30, "Last Name can't exceed 30 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone_number: Yup.string()
    .min(10, "Contact must be 10 characters")
    .max(10, "Contact can't exceed 10 characters")
    .required("Contact number is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(16, "Password can't exceed 16 characters"),
  confirm_password: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});
const UpdateManagers = () => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [managerDetails, setManagerDetails] = useState(null);

  const handlePermissionsChange = (obj) => {
    setSelectedPermissions((prevPermissions) => {
      Object.keys(obj).forEach((catName) => {
        if (!prevPermissions.hasOwnProperty(catName)) {
          prevPermissions[catName] = {};
        }
        prevPermissions[catName] = {
          ...prevPermissions[catName],
          ...obj[catName],
        };
      });

      return { ...prevPermissions };
    });
  };

  const getManagerdetails = async () => {
    const data = await callApiGet(`get-manager/${id}`);
    console.log(data);
    if (data.success) {
      if (data.data) {
        setManagerDetails(data.data);
      } else {
        setManagerDetails([]);
      }
    } else {
      if (data.msg === "Manager not found") {
        setManagerDetails([]);
      }
      alert(data.msg);
    }
  };
  const initialValues = {
    first_name: managerDetails?.first_name || "",
    last_name: managerDetails?.last_name || "",
    email: managerDetails?.email || "",
    phone_number: managerDetails?.phone_number || "",
    password: "",
    confirm_password: "",
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      if (
        values.password.length > 0 &&
        values.confirm_password !== values.password
      ) {
        alert("password not matched");
      } else {
        const data = await callApi(
          `admin/edit-user-info/manager/${managerDetails.user_id}`,
          "POST",
          {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone_number: values.phone_number,
          }
        );
        if (data.success) {
          alert(data.msg);
        } else {
          alert(data.msg);
        }
      }
    },
  });

  useEffect(() => {
    if (id) {
      getManagerdetails();
    }
  }, [id]);

  if (!managerDetails) {
    return <LoadingScreen />;
  }
  if (managerDetails.length === 0) {
    return <DataNotAvailable />;
  }

  return (
    <div>
      <div className="w-full p-4">
        <div className="w-full bg-white shadow-md rounded p-4">
          <h1 className="text-xl font-semibold">Edit Manager</h1>
          <p className="text-sm">Edit user, assign roles & permissions</p>
        </div>
      </div>

      {/*UPDATE MANAGER FORM*/}
      <div className="flex gap-4 p-4 flex-wrap lg:flex-nowrap">
        <div className="w-full p-4 bg-white shadow-md rounded">
          <form onSubmit={formik.handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
            <hr className="border-gray-300 mb-8" />
            <div className="flex justify-between mb-3">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  placeholder=" First Name"
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
                  type="text"
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
          </form>
        </div>
        {/* RIGHT DIV FOR PASSWORD RESET */}
        <div className="w-full p-4 bg-white shadow-md rounded">
          <form onSubmit={formik.handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <hr className="border-gray-300 mb-8" />
            <div className="w-full px-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="text"
                name="password"
                placeholder="New Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`mt-1 block w-full border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <div className="w-full px-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="text"
                name="confirm_password"
                placeholder="Confirm Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirm_password}
                className={`mt-1 block w-full border ${
                  formik.touched.confirm_password &&
                  formik.errors.confirm_password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {formik.touched.confirm_password &&
              formik.errors.confirm_password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.confirm_password}
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </div>

      {/* PERMISSION SECTION */}
      <div className="w-full p-4">
        <div className="w-full p-4 bg-white shadow-md rounded">
          <h2 className="text-lg font-semibold mb-4">Permissions</h2>
          <hr className="border-gray-300 mb-8" />
          <PermissionForm onUpdate={handlePermissionsChange} />
          <form onSubmit={formik.handleSubmit}>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

UpdateManagers.layout = UserDashboard;
export default UpdateManagers;
