import UserDashboard from "@/layouts/UserDashboard";
import React from "react";
import ManagersTable from "../Tables/ManagersTable";

const IndividualManagers = ({ managers }) => {
  return (
    <div className="mt-4">
      <ManagersTable users={managers} />
    </div>
  );
};
IndividualManagers.layout = UserDashboard;
export default IndividualManagers;
