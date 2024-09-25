import React, { useEffect, useState } from "react";
import style from "../../css/application.module.css";
import ConfirmationDialog from "@/components/DialogBox/DialogBox";
import UserDashboard from "@/layouts/UserDashboard";
import { useRouter } from "next/router";
import DataNotAvailable from "@/components/DataNotAvailable/DataNotAvailable";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import { callApi, callApiGet } from "@/utils/FetchApi";
import DocumentViews from "@/components/DocumentsView/DocumentsView";
import { acceptSeller } from "@/store/slices/sellerSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllApprovedSellers } from "@/utils/getData";

const RejectedApplicationDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [reviewText, setReviewText] = useState("");
  const [membership, setMembership] = useState("1");
  const [isDialogOpenAcpt, setIsDialogOpenAcpt] = useState(false);
  const [SellerDetails, setSellerDetails] = useState(null);
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.sellers);

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
        type: "seller",
        status: "approved",
        rating: +membership,
      }
    );
    if (data.success) {
      if (!sellers) {
        getAllApprovedSellers(dispatch);
      }
      dispatch(acceptSeller({ data: SellerDetails, key: "rejApp" }));
      router.push("/sellers/rejected-applications");
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

  const getSellersdetails = async () => {
    const data = await callApiGet(`admin/get-user-info/seller/${id}`);
    console.log(data);
    if (data.success) {
      if (data.userDetails) {
        setSellerDetails(data.userDetails);
      } else {
        setSellerDetails([]);
      }
    } else {
      if (data.msg === "User not found") {
        setSellerDetails([]);
      }
      alert(data.msg);
    }
  };

  useEffect(() => {
    if (id) {
      getSellersdetails();
    }
  }, [id]);

  if (!SellerDetails) {
    return <LoadingScreen />;
  }
  if (SellerDetails.length === 0) {
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
            <p>{SellerDetails.user_id}</p>
          </div>
          <div className={style.info_item}>
            <label>Name:</label>
            <p>
              {SellerDetails.first_name} {SellerDetails.last_name}
            </p>
          </div>
          <div className={style.info_item}>
            <label>Company Name:</label>
            <p>{SellerDetails.company_name}</p>
          </div>
          <div className={style.info_item}>
            <label>GST No:</label>
            <p>{SellerDetails.gst_number}</p>
          </div>
          {SellerDetails?.pan_number && (
            <div className={style.info_item}>
              <label>PAN No:</label>
              <p>{SellerDetails.pan_number}</p>
            </div>
          )}

          {SellerDetails?.adhaar_number && (
            <div className={style.info_item}>
              <label>Aadhar No:</label>
              <p>{SellerDetails.adhaar_number}</p>
            </div>
          )}
          <div className={style.info_item}>
            <label>Phone:</label>
            <p>{SellerDetails.phone_number}</p>
          </div>
          <div className={style.info_item}>
            <label>Email:</label>
            <p>{SellerDetails.email}</p>
          </div>
        </div>
      </div>

      <div className={style.right_card}>
        <DocumentViews documents={SellerDetails} />
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
            desc: "Do you confirm want to accept this seller application ?",
          }}
        />
      </div>
    </div>
  );
};
RejectedApplicationDetails.layout = UserDashboard;
export default RejectedApplicationDetails;
