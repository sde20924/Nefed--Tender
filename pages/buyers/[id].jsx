// application.js

import React, { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import style from "../css/buyers.module.css";
import { useRouter } from "next/router";
import UserDashboard from "@/layouts/UserDashboard";
import IndividualManagers from "@/components/IndividualManagers/IndividualManagers";
import { callApi, callApiGet } from "@/utils/FetchApi";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import DataNotAvailable from "@/components/DataNotAvailable/DataNotAvailable";
import DocumentViews from "@/components/DocumentsView/DocumentsView";

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

const BuyersDetails = () => {
  const rating = {
    1: "Bronze",
    2: "Silver",
    3: "Gold",
    4: "Platinum",
  };

  const router = useRouter();
  const { edit, id } = router.query;
  const [isEditMode, setIsEditMode] = useState(edit ? edit : false);
  const [buyerDetails, setBuyerDetails] = useState(null);
  const [managers, setManagers] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: buyerDetails?.first_name || "",
    lastName: buyerDetails?.last_name || "",
    companyName: buyerDetails?.company_name || "",
    email: buyerDetails?.email || "",
    phone: buyerDetails?.phone_number || "",
    gstNo: buyerDetails?.gst_number || "",
    pan: buyerDetails?.pan_number || "",
    registrationNo: buyerDetails?.registration_number || "",
  });

  const toggleEditMode = () => {
    setInitialValues({
      name: buyerDetails.first_name,
      lastName: buyerDetails.last_name,
      companyName: buyerDetails.company_name || "",
      email: buyerDetails.email,
      phone: buyerDetails.phone_number,
      gstNo: buyerDetails.gst_number,
      pan: buyerDetails.pan_number || "",
      registrationNo: buyerDetails.registration_number || "",
    });
    setIsEditMode(!isEditMode);
  };

  const handleFormSubmit = async (values, actions) => {
    const data = await callApi(`admin/edit-user-info/buyer/${id}`, "POST", {
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

  const getBuyersdetails = async () => {
    const data = await callApiGet(`admin/get-user-info/buyer/${id}`);
    console.log(data);
    if (data.success) {
      if (data.userDetails) {
        setBuyerDetails(data.userDetails);
        setInitialValues({
          name: data.userDetails.first_name,
          lastName: data.userDetails.last_name,
          companyName: data.userDetails.company_name || "",
          email: data.userDetails.email,
          phone: data.userDetails.phone_number,
          gstNo: data.userDetails.gst_number,
          pan: data.userDetails.pan_number || "",
          registrationNo: data.userDetails.registration_number || "",
        });
      } else {
        setBuyerDetails([]);
      }
      setManagers(data.managers);
    } else {
      if (data.msg === "User not found") {
        setBuyerDetails([]);
      }
      alert(data.msg);
    }
  };

  useEffect(() => {
    if (id) {
      getBuyersdetails();
    }
  }, [id]);

  if (!buyerDetails) {
    return <LoadingScreen />;
  }
  if (buyerDetails.length === 0) {
    return <DataNotAvailable />;
  }

  return (
    <div>
      <div className={style.app_details}>
        <div className={style.left_card}>
          <h3>Buyer Details</h3>
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
                    <p>{values.gstNo} </p>
                  </div>
                </div>
                <div className={style.info_item}>
                  <label htmlFor="rating_id">Rating:</label>
                  <div>
                    <p>{rating[+buyerDetails?.rating_id]}</p>
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
                    display: !buyerDetails.registration_number && "none",
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

        <DocumentViews documents={buyerDetails} className={style.right_card} />
      </div>

      <div className="p-4">
        <div className="p-4 shadow-lg bg-white rounded-lg">
          <h1 className="text-lg font-medium">
            All managers of {buyerDetails.first_name} {buyerDetails.last_name}
          </h1>
          <IndividualManagers managers={managers} />
        </div>
      </div>
    </div>
  );
};

BuyersDetails.layout = UserDashboard;
export default BuyersDetails;
