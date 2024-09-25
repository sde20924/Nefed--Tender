import React, { useEffect, useState } from "react";
import UserTable from "@/components/Tables/UserTableForBuyer";
import UserDashboard from "@/layouts/UserDashboard";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { addBuyersToRedux } from "@/store/slices/buyersSlice";
import { callApiGet } from "@/utils/FetchApi";
import { getAllApprovedBuyers } from "@/utils/getData";

// const getAllApprovedBuyers = async (dispatch) => {
//   // setLoading(true);
//   const data = await callApiGet("get-all-verified-buyers");
//   console.log(data);
//   if (data.success) {
//     if (data.data) {
//       dispatch(addBuyersToRedux(data.data));
//     } else {
//       dispatch(addBuyersToRedux([]));
//     }
//     // setLoading(false);
//   } else {
//     // alert(data.msg);
//     // setLoading(false);
//   }
// };

export default function BuyersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const route = useRouter();
  const dispatch = useDispatch();
  const { buyers } = useSelector((state) => state.buyers);

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleRefreshClick = () => {
    getAllApprovedBuyers(dispatch);
  };

  useEffect(() => {
    if (!buyers) {
      getAllApprovedBuyers(dispatch);
    }
  }, [buyers]);

  return (
    <>
      <div className="w-full" style={{ padding: "16px" }}>
        <HeaderTitle
          title={"All Verified Buyers"}
          subTitle={"View buyers, add, edit, block & delete "}
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
              onClick={() => route.push("/buyers/add-buyer")}
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
              Add New Buyer
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
        <UserTable users={buyers} />
      </div>
    </>
  );
}

BuyersPage.layout = UserDashboard;
