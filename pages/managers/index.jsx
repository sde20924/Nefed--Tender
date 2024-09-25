import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import ManagersTable from "@/components/Tables/ManagersTable";
import UserDashboard from "@/layouts/UserDashboard";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllManagers, updateMSGManager } from "@/store/slices/managersSlice";

const Managers = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { managers, managersLoading, m_msg } = useSelector(
    (state) => state.managers
  );

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };
  const addNewManagers = () => {
    router.push("/managers/add-managers");
  };

  const handleRefreshClick = () => {
    dispatch(getAllManagers());
  };
  
  useEffect(() => {
    if (m_msg) {
      alert(m_msg);
      dispatch(updateMSGManager());
    }
  }, [m_msg]);
  useEffect(() => {
    if (!managers) {
      dispatch(getAllManagers());
    }
  }, [managers]);
  return (
    <div className="w-full" style={{ padding: "16px" }}>
      <HeaderTitle
        title={"All Managers"}
        subTitle={"View managers, add, edit, block & delete "}
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
          onClick={addNewManagers}
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
          Add New Manager
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
      <ManagersTable users={managers} />
    </div>
  );
};
Managers.layout = UserDashboard;
export default Managers;
