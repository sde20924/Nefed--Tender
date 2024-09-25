import DataNotAvailable from "@/components/DataNotAvailable/DataNotAvailable";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import UserDashboard from "@/layouts/UserDashboard";
import { callApiGet } from "@/utils/FetchApi";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllNewSellers,
  getAllNewSellers,
  updateMSGSeller,
} from "@/store/slices/sellerSlice";

const NewApplications = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { newSellers } = useSelector((state) => state.sellers);

  // PAGINATION CODE
  const usersPerPage = 10;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers =
    newSellers && newSellers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(newSellers && newSellers.length / usersPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handling Input
  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const getAllNewSellers = async () => {
    const data = await callApiGet("get-all-pending-sellers");
    console.log(data);
    if (data.success) {
      if (data.data) {
        dispatch(addAllNewSellers(data.data));
      } else {
        dispatch(addAllNewSellers([]));
      }
    } else {
      alert(data.msg);
    }
  };

  const handleRefreshClick = () => {
    getAllNewSellers();
  };

  useEffect(() => {
    if (!newSellers) {
      getAllNewSellers();
    }
  }, [newSellers]);
  return (
    <div className="w-full" style={{ padding: "16px" }}>
      <HeaderTitle
        title={"New Applications Of Sellers"}
        subTitle={"View applications, review it & reject or accept"}
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

      {/* TABLE CODE START */}
      {!newSellers ? (
        <LoadingScreen />
      ) : newSellers.length === 0 ? (
        <DataNotAvailable />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full bg-white">
            <thead style={{ background: "#161e29", color: "white" }}>
              <tr>
                <th className="text-left py-2 px-4">#</th>
                <th className="text-left py-2 px-4">Name</th>
                <th className="text-left py-2 px-4">Email</th>
                <th className="text-left py-2 px-4">Phone</th>
                <th className="text-left py-2 px-4">Status</th>
                <th className="text-left py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.user_id} className="border-b">
                  <td className="py-2 px-4">{indexOfFirstUser + index + 1}</td>
                  <td className="py-2 px-4">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.phone_number}</td>
                  <td className="py-2 px-4">{user.status}</td>
                  <td className="py-2 px-4 flex justify-start">
                    <button
                      onClick={() =>
                        router.push(`new-applications/${user.user_id}`)
                      }
                      className="flex items-center bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold py-3 px-5 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4m0 4h.01m-6.938 4h13.856C18.98 20 21 17.98 21 15.362V8.638C21 6.02 18.98 4 16.362 4H7.638C5.02 4 3 6.02 3 8.638v6.724C3 17.98 5.02 20 7.638 20z"
                        />
                      </svg>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* TABLE CODE END*/}
    </div>
  );
};
NewApplications.layout = UserDashboard;
export default NewApplications;
