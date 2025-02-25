import React, { useEffect, useState } from "react";
import style from "../../css/application.module.css";
import ConfirmationDialog from "@/components/DialogBox/DialogBox";
import UserDashboard from "@/layouts/UserDashboard";
import { useRouter } from "next/router";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import DataNotAvailable from "@/components/DataNotAvailable/DataNotAvailable";
import { callApi, callApiGet } from "@/utils/FetchApi";
import DocumentViews from "@/components/DocumentsView/DocumentsView";
import { useDispatch, useSelector } from "react-redux";
import { acceptSeller, rejectSeller } from "@/store/slices/sellerSlice";
import { getAllApprovedSellers, getAllRejectedSellers } from "@/utils/getData";

const ApplicationDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [remarkText, setRemarkText] = useState("");
  const [membership, setMembership] = useState("1");
  const [isDialogOpenAcpt, setIsDialogOpenAcpt] = useState(false);
  const [isDialogOpenRjct, setIsDialogOpenRjct] = useState(false);
  const [newSellerDetails, setNewSellerDetails] = useState(null);
  const dispatch = useDispatch();
  const { rejectedSellers, sellers } = useSelector((state) => state.sellers);
  // Function to handle review text change
  const handleRemarkChange = (e) => {
    setRemarkText(e.target.value);
  };

  // Function to handle membership selection
  const handleMembershipChange = (e) => {
    setMembership(e.target.value);
  };

  // Function to handle accept action
  const handleAccept = async () => {
    const data = await callApi(
      "admin/update-application-status-and-rating",
      "POST",
      {
        user_id: id,
        type: "seller",
        status: "approved",
        rating: +membership,
      }
    );
    if (data.success) {
      if (!sellers) {
        getAllApprovedSellers(dispatch);
      }
      dispatch(acceptSeller({ data: newSellerDetails, key: "newApp" }));
      router.push("/sellers/new-applications");
    }
    alert(data.msg);
    closeDialog();
  };

  // Function to handle reject action
  const handleReject = async () => {
    const data = await callApi("admin/reject-application", "POST", {
      user_id: id,
      type: "seller",
    });
    if (data.success) {
      if (!rejectedSellers) {
        getAllRejectedSellers(dispatch);
      }
      dispatch(rejectSeller({ data: newSellerDetails }));
      router.push("/sellers/new-applications");
    }
    alert(data.msg);
    closeDialog();
  };

  //Dialog code
  const openDialogForAccept = () => {
    setIsDialogOpenAcpt(true);
  };
  const openDialogForReject = () => {
    setIsDialogOpenRjct(true);
  };
  //close Dialog
  const closeDialog = () => {
    setIsDialogOpenAcpt(false);
    setIsDialogOpenRjct(false);
  };

  const getSellersdetails = async () => {
    const data = await callApiGet(`admin/get-user-info/seller/${id}`);
    console.log(data);
    if (data.success) {
      if (data.userDetails) {
        setNewSellerDetails(data.userDetails);
      } else {
        setNewSellerDetails([]);
      }
    } else {
      if (data.msg === "User not found") {
        setNewSellerDetails([]);
      }
      alert(data.msg);
    }
  };
  useEffect(() => {
    if (id) {
      getSellersdetails();
    }
  }, [id]);

  if (!newSellerDetails) {
    return <LoadingScreen />;
  }
  if (newSellerDetails.length === 0) {
    return <DataNotAvailable />;
  }
  return (
    <div className={style.app_details}>
      <div
        className={`${
          newSellerDetails.status === "not_verified" ? "w-3/5" : "min-w-fit"
        }`}
      >
        <div className={style.left_card}>
          <h3>Applicant Information</h3>
          <div className={style.info_item}>
            <label>User ID:</label>
            <p>{newSellerDetails.user_id}</p>
          </div>
          <div className={style.info_item}>
            <label>Name:</label>
            <p>
              {newSellerDetails.first_name} {newSellerDetails.last_name}
            </p>
          </div>
          <div className={style.info_item}>
            <label>Company Name:</label>
            <p>{newSellerDetails.company_name}</p>
          </div>
          <div className={style.info_item}>
            <label>GST No:</label>
            <p>{newSellerDetails.gst_number}</p>
          </div>
          {newSellerDetails?.pan_number && (
            <div className={style.info_item}>
              <label>PAN No:</label>
              <p>{newSellerDetails.pan_number}</p>
            </div>
          )}

          {newSellerDetails?.adhaar_number && (
            <div className={style.info_item}>
              <label>Aadhar No:</label>
              <p>{newSellerDetails.adhaar_number}</p>
            </div>
          )}
          <div className={style.info_item}>
            <label>Phone:</label>
            <p>{newSellerDetails.phone_number}</p>
          </div>
          <div className={style.info_item}>
            <label>Email:</label>
            <p>{newSellerDetails.email}</p>
          </div>
        </div>
      </div>
      <div
        className={`${style.right_card} ${
          newSellerDetails.status === "not_verified" && "hidden"
        }`}
      >
        <DocumentViews documents={newSellerDetails} />

        <div className={style.membership_section}>
          <h3>Membership Type</h3>
          <select
            value={membership}
            onChange={handleMembershipChange}
            className={style.membership_select}
          >
            <option value="1">🏆 Bronze</option>
            <option value="2">🥈 Silver</option>
            <option value="3">👑 Gold</option>
            <option value="4">💎 Platinum</option>
          </select>
        </div>

        <div className={style.review_section}>
          <h3>Remarks</h3>
          <textarea
            id="review_text"
            placeholder="Enter your remarks..."
            value={remarkText}
            onChange={handleRemarkChange}
          ></textarea>
        </div>

        <div className={style.action_buttons}>
          <button onClick={openDialogForAccept}>Accept</button>
          <button onClick={openDialogForReject}>Reject</button>
        </div>

        {/* Dialog for accept */}
        <ConfirmationDialog
          okPress={handleAccept}
          isOpen={isDialogOpenAcpt}
          onClose={closeDialog}
          data={{
            title: "Confirmation message",
            desc: "Do you confirm want to accept this seller application ?",
          }}
        />
        {/* Dialog for Reject */}
        <ConfirmationDialog
          okPress={handleReject}
          isOpen={isDialogOpenRjct}
          onClose={closeDialog}
          data={{
            title: "Confirmation message",
            desc: "Do you confirm want to reject this seller application ?",
          }}
        />
      </div>
    </div>
  );
};

ApplicationDetails.layout = UserDashboard;
export default ApplicationDetails;
