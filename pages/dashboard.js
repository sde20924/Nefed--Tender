import React, { useEffect, useState } from "react";
// components
import CardLineChart from "@/components/Cards/CardLineChart";
import CardBarChart from "@/components/Cards/CardBarChart";
import CardPageVisits from "@/components/Cards/CardPageVisits";
import CardSocialTraffic from "@/components/Cards/CardSocialTraffic";
import HeaderStats from "@/components/Headers/HeaderStats";

// layout for page

import UserDashboard from "@/layouts/UserDashboard";
import { useDispatch, useSelector } from "react-redux";
import { getProfileData } from "@/store/slices/profileSlice";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import UploadFilesModal from "@/components/Modal/UploadFilesModal";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { profileData, profileLoading } = useSelector(
    (state) => state.profileData
  );
  const userData = JSON.parse(localStorage.getItem("data")) || null;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!profileData) {
      dispatch(getProfileData());
    } else {
      const count = +localStorage.getItem("openModal") || null;
      if (count) {
        openModal();
        localStorage.removeItem("openModal");
      }
    }
  }, [profileData]);

  if (!profileData) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="flex flex-wrap md:pt-32 pb-32 pt-12">
        {/* <div className="w-full mb-8">
          <HeaderStats />
        </div>
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardLineChart />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardBarChart />
        </div>
      </div>
      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardPageVisits />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardSocialTraffic />
        </div> */}
        {profileData?.buyer_id && (
          <UploadFilesModal
            docs={profileData?.docs}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}
        {profileData?.seller_id && (
          <UploadFilesModal
            docs={profileData?.docs}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}
        <div style={{ width: "100%", padding: "16px", textAlign: "center" }}>
          <h1 style={{ fontSize: "32px", color: "bluegray" }}>
            Hii, {userData && userData?.data?.first_name}
          </h1>
          <h1 style={{ fontSize: "24px", color: "#f43374" }}>
            Welcome to {userData && userData?.login_as} panel
          </h1>
          <p
            className={`${
              userData && userData?.login_as === "admin" && "hidden"
            } ${userData && userData?.login_as === "manager" && "hidden"}`}
          >
            (You belongs to&nbsp;
            {profileData?.tag_name} tag)
          </p>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = UserDashboard;
