import UserDashboard from "@/layouts/UserDashboard";
import React from "react";
import PersonalForm from "../../components/Forms/AddManagersForm";

const AddManagers = () => {
  return (
    <div>
      <div className="w-full p-4">
        <div className="w-full bg-white shadow-md rounded p-4">
          <h1 className="text-xl font-semibold">Add Manager</h1>
          <p className="text-sm">Create new user, assign roles & permissions</p>
        </div>
      </div>
      <PersonalForm />
    </div>
  );
};

AddManagers.layout = UserDashboard;
export default AddManagers;
