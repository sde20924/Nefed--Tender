import React, { useEffect, useState } from "react";
import UserDashboard from "@/layouts/UserDashboard";
import UserTableForSeller from "@/components/Tables/UserTableForSeller";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllSellers, updateMSGSeller } from "@/store/slices/sellerSlice";
import { getAllApprovedSellers } from "@/utils/getData";

export default function SellersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.sellers);

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };
  const handleRefreshClick = () => {
    getAllApprovedSellers(dispatch);
  };
  useEffect(() => {
    if (!sellers) {
      getAllApprovedSellers(dispatch);
    }
  }, [sellers]);
  return (
    <>
      <div className="w-full" style={{ padding: "16px" }}>
        <HeaderTitle
          title={"All Verified Sellers"}
          subTitle={"View sellers, add, edit, block & delete "}
        />
        {/* SEARCH BAR CODE START*/}
        <div className="flex flex-wrap justify-between gap-4 pt-4 pb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange}
            className="min-w-72 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => router.push("/sellers/add-seller")}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add New Seller
            </button>
            <button
              onClick={handleRefreshClick}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>
        {/* SEARCH BAR CODE END */}
        <UserTableForSeller users={sellers} />
      </div>
    </>
  );
}

SellersPage.layout = UserDashboard;
