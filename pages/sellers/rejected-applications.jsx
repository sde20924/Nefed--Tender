import DataNotAvailable from "@/components/DataNotAvailable/DataNotAvailable";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import UserDashboard from "@/layouts/UserDashboard";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRejectedSellers } from "@/utils/getData";

const RejectedApplication = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { rejectedSellers } = useSelector((state) => state.sellers);

  // PAGINATION CODE
  const usersPerPage = 10;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers =
    rejectedSellers && rejectedSellers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(
    rejectedSellers && rejectedSellers.length / usersPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRefreshClick = () => {
    getAllRejectedSellers(dispatch);
  };

  useEffect(() => {
    if (!rejectedSellers) {
      getAllRejectedSellers(dispatch);
    }
  }, [rejectedSellers]);
  return (
    <div className="w-full" style={{ padding: "16px" }}>
      <HeaderTitle
        title={"Rejected Applications Of Sellers"}
        subTitle={"View applications & accept"}
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={handleRefreshClick}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        >
          Refresh
        </button>
      </div>
      {/* TABLE CODE START */}
      {!rejectedSellers ? (
        <LoadingScreen />
      ) : rejectedSellers.length === 0 ? (
        <DataNotAvailable />
      ) : (
        <div className="w-full mt-4 overflow-x-auto">
          <table className="w-full bg-white">
            <thead style={{ background: "#161e29", color: "white" }}>
              <tr>
                <th className="text-left py-2 px-4">#</th>
                <th className="text-left py-2 px-4">Name</th>
                <th className="text-left py-2 px-4">Email</th>
                <th className="text-left py-2 px-4">Phone</th>
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
                  <td className="py-2 px-4 flex justify-start">
                    <button
                      onClick={() =>
                        router.push(`rejected-applications/${user.user_id}`)
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
                      View
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
RejectedApplication.layout = UserDashboard;
export default RejectedApplication;
