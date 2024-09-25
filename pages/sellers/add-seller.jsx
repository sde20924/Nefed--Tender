import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React from "react";
import AddSellerForm from "../../components/Forms/AddSellerForm";

const AddSeller = () => {
  return (
    <div>
      <HeaderTitle
        padding={"p-4"}
        title={"Add Seller"}
        subTitle={"Create new seller"}
      />
      <AddSellerForm />
    </div>
  );
};
AddSeller.layout = UserDashboard;
export default AddSeller;
