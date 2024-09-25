import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React from "react";
import AddBuyerForm from "../../components/Forms/AddBuyerForm";

const AddBuyers = () => {
  return (
    <div>
      <HeaderTitle
        padding={"p-4"}
        title={"Add buyer"}
        subTitle={"Create new buyer"}
      />
      <AddBuyerForm />
    </div>
  );
};

AddBuyers.layout = UserDashboard;
export default AddBuyers;
