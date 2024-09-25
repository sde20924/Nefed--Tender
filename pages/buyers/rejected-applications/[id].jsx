import React, { useEffect, useState } from "react";
import style from "../../css/application.module.css";
import ConfirmationDialog from "@/components/DialogBox/DialogBox";
import UserDashboard from "@/layouts/UserDashboard";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import DataNotAvailable from "@/components/DataNotAvailable/DataNotAvailable";
import { callApi, callApiGet } from "@/utils/FetchApi";
import { useRouter } from "next/router";
import DocumentViews from "@/components/DocumentsView/DocumentsView";
import { useDispatch, useSelector } from "react-redux";
import { acceptBuyer } from "@/store/slices/buyersSlice";
import { getAllApprovedBuyers } from "@/utils/getData";

const RejectedApplicationDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [reviewText, setReviewText] = useState("");
  const [membership, setMembership] = useState("1");
  const [isDialogOpenAcpt, setIsDialogOpenAcpt] = useState(false);
  const [buyerDetails, setBuyerDetails] = useState(null);
  const dispatch = useDispatch();
  const { buyers } = useSelector((state) => state.buyers);
  // Function to handle review text change
  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
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
        type: "buyer",
        status: "approved",
        rating: +membership,
      }
    );
    if (data.success) {
      if (!buyers) {
        getAllApprovedBuyers(dispatch);
      }
      dispatch(acceptBuyer({ data: buyerDetails, key: "rejApp" }));
      router.push("/buyers/rejected-applications");
    }
    alert(data.msg);
    closeDialog();
  };

  // Dialog code
  const openDialogForAccept = () => {
    setIsDialogOpenAcpt(true);
  };
  const closeDialog = () => {
    setIsDialogOpenAcpt(false);
  };

  const getBuyersDetails = async () => {
    const data = await callApiGet(`admin/get-user-info/buyer/${id}`);
    console.log(data);
    if (data.success) {
      if (data.userDetails) {
        setBuyerDetails(data.userDetails);
      } else {
        setBuyerDetails([]);
      }
    } else {
      if (data.msg === "User not found") {
        setBuyerDetails([]);
      }
      alert(data.msg);
    }
  };

  useEffect(() => {
    if (id) {
      getBuyersDetails();
    }
  }, [id]);

  if (!buyerDetails) {
    return <LoadingScreen />;
  }
  if (buyerDetails.length === 0) {
    return <DataNotAvailable />;
  }
  return (
    <div className={style.app_details}>
      <div className="min-w-fit">
        <div className={style.left_card}>
          <h4 style={{ padding: "10px" }}>
            Status: <span style={{ color: "red" }}>Rejected</span>
          </h4>
          <h3>Applicant Information</h3>
          <div className={style.info_item}>
            <label>Application ID:</label>
            <p>{buyerDetails.user_id}</p>
          </div>
          <div className={style.info_item}>
            <label>Name:</label>
            <p>
              {buyerDetails.first_name} {buyerDetails.last_name}
            </p>
          </div>
          <div className={style.info_item}>
            <label>Company Name:</label>
            <p>{buyerDetails.company_name}</p>
          </div>
          <div className={style.info_item}>
            <label>GST No:</label>
            <p>{buyerDetails.gst_number}</p>
          </div>
          {buyerDetails?.pan_number && (
            <div className={style.info_item}>
              <label>PAN No:</label>
              <p>{buyerDetails.pan_number}</p>
            </div>
          )}
          {buyerDetails?.adhaar_number && (
            <div className={style.info_item}>
              <label>Aadhar No:</label>
              <p>{buyerDetails.adhaar_number}</p>
            </div>
          )}
          <div className={style.info_item}>
            <label>Phone:</label>
            <p>{buyerDetails.phone_number}</p>
          </div>
          <div className={style.info_item}>
            <label>Email:</label>
            <p>{buyerDetails.email}</p>
          </div>
        </div>
      </div>

      <div className={style.right_card}>
        <DocumentViews documents={buyerDetails} />
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
          <h3>Review</h3>
          <textarea
            id="review_text"
            placeholder="Enter your review..."
            value={reviewText}
            onChange={handleReviewChange}
          ></textarea>
        </div>

        <div className={style.reject_page_btn}>
          <button onClick={openDialogForAccept}>Accept</button>
        </div>
        {/* Dialog for accept */}
        <ConfirmationDialog
          okPress={handleAccept}
          isOpen={isDialogOpenAcpt}
          onClose={closeDialog}
          data={{
            title: "Confirmation message",
            desc: "Do you confirm want to accept this application ?",
          }}
        />
      </div>
    </div>
  );
};
RejectedApplicationDetails.layout = UserDashboard;
export default RejectedApplicationDetails;
