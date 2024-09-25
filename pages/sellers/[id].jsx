// application.js

import React, { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import style from "../css/buyers.module.css";
import { useRouter } from "next/router";
import UserDashboard from "@/layouts/UserDashboard";
import IndividualManagers from "@/components/IndividualManagers/IndividualManagers";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import DataNotAvailable from "@/components/DataNotAvailable/DataNotAvailable";
import DocumentViews from "@/components/DocumentsView/DocumentsView";
import { callApi, callApiGet } from "@/utils/FetchApi";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name can't exceed 30 characters")
    .required("Name is required"),
  lastName: Yup.string()
    .min(3, "Last Name must be at least 3 characters")
    .max(30, "Last Name can't exceed 30 characters")
    .required("Last Name is required"),
  // companyName: Yup.string()
  //   .min(3, "Company Name must be at least 3 characters")
  //   .max(60, "Company Name can't exceed 60 characters")
  //   .required("Company Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Phone number must be exactly 10 digits")
    .required("Phone is required"),
  // gstNo: Yup.string()
  //   .matches(
  //     /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})?$/,
  //     "Invalid GST number"
  //   )
  //   .required("GST number is required"),
  // pan: Yup.string()
  //   .matches(
  //     /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  //     "PAN must be 10 characters long, starting with 5 letters, followed by 4 digits and ending with 1 letter"
  //   )
  //   .required("PAN is required"),
  // registrationNo: Yup.string().optional(),
});

const SellerDetails = () => {
  const router = useRouter();
  const { edit, id } = router.query;
  const [isEditMode, setIsEditMode] = useState(edit ? edit : false);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [managers, setManagers] = useState(null);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleFormSubmit = async (values, actions) => {
    const data = await callApi(`admin/edit-user-info/seller/${id}`, "POST", {
      first_name: values.name,
      last_name: values.lastName,
      email: values.email,
      phone_number: values.phone,
    });
    if (data.success) {
      alert(data.msg);
      toggleEditMode();
    } else {
      alert(data.msg);
    }
  };

  const getSellersDetails = async () => {
    const data = await callApiGet(`admin/get-user-info/seller/${id}`);
    console.log(data);
    if (data.success) {
      if (data.userDetails) {
        setSellerDetails(data.userDetails);
      } else {
        setSellerDetails([]);
      }
      setManagers(data.managers);
    } else {
      if (data.msg === "User not found") {
        setSellerDetails([]);
      }
      alert(data.msg);
    }
  };

  useEffect(() => {
    if (id) {
      getSellersDetails();
    }
  }, [id]);

  if (!sellerDetails) {
    return <LoadingScreen />;
  }
  if (sellerDetails.length === 0) {
    return <DataNotAvailable />;
  }

  const initialValues = {
    name: sellerDetails.first_name,
    lastName: sellerDetails.last_name,
    companyName: sellerDetails.company_name || "",
    email: sellerDetails.email,
    phone: sellerDetails.phone_number,
    gstNo: sellerDetails.gst_number,
    pan: sellerDetails.pan_number || "",
    registrationNo: sellerDetails.registration_number || "",
  };
  return (
    <div>
      <div className={style.app_details}>
        <div className={style.left_card}>
          <h3>Sellers Details</h3>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
            enableReinitialize // Enable reinitialization to switch between edit and view mode
          >
            {({ handleSubmit, handleChange, values, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <div className={style.info_item}>
                  <label htmlFor="name">Name:</label>
                  <div>
                    {!isEditMode ? (
                      <p>{values.name}</p>
                    ) : (
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        className={style.input_field}
                      />
                    )}
                    <ErrorMessage
                      name="name"
                      component="div"
                      className={style.error}
                    />
                  </div>
                </div>

                <div className={style.info_item}>
                  <label htmlFor="lastName">Last Name:</label>
                  <div>
                    {!isEditMode ? (
                      <p>{values.lastName}</p>
                    ) : (
                      <Field
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        className={style.input_field}
                      />
                    )}
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className={style.error}
                    />
                  </div>
                </div>

                <div className={style.info_item}>
                  <label htmlFor="email">Email:</label>
                  <div>
                    {!isEditMode ? (
                      <p>{values.email}</p>
                    ) : (
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        className={style.input_field}
                      />
                    )}
                    <ErrorMessage
                      name="email"
                      component="div"
                      className={style.error}
                    />
                  </div>
                </div>

                <div className={style.info_item}>
                  <label htmlFor="phone">Phone:</label>
                  <div>
                    {!isEditMode ? (
                      <p>{values.phone}</p>
                    ) : (
                      <Field
                        type="text"
                        id="phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        className={style.input_field}
                      />
                    )}
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className={style.error}
                    />
                  </div>
                </div>

                <div className={style.info_item}>
                  <label htmlFor="companyName">Company Name:</label>
                  <div>
                    <p>{values.companyName}</p>
                  </div>
                </div>

                <div className={style.info_item}>
                  <label htmlFor="gstNo">GST No:</label>
                  <div>
                    <p>{values.gstNo}</p>
                  </div>
                </div>

                {values.pan !== "" && (
                  <div className={style.info_item}>
                    <label htmlFor="pan">PAN No:</label>
                    <div>
                      <p>{values.pan}</p>
                    </div>
                  </div>
                )}

                <div
                  className={style.info_item}
                  style={{
                    display: !sellerDetails.registration_number && "none",
                  }}
                >
                  <label htmlFor="registrationNo">Registration No:</label>
                  <div>
                    <p>{values.registrationNo}</p>
                  </div>
                </div>

                {!isEditMode ? (
                  <div className={style.action_buttons}>
                    <button
                      type="button"
                      className={style.action_button}
                      onClick={toggleEditMode}
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className={style.action_buttons}>
                    <button
                      type="button"
                      className={style.action_button}
                      onClick={toggleEditMode}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={style.action_button}>
                      Save
                    </button>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </div>
        <DocumentViews documents={sellerDetails} className={style.right_card} />
      </div>
      <div className="p-4">
        <div className="p-4 shadow-lg bg-white rounded-lg">
          <h1 className="text-lg font-medium">
            All managers of {sellerDetails.first_name} {sellerDetails.last_name}
          </h1>
          <IndividualManagers managers={managers} />
        </div>
      </div>
    </div>
  );
};

SellerDetails.layout = UserDashboard;
export default SellerDetails;
