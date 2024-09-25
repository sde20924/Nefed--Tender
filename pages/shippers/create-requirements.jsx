import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React from "react";

const Tenders = () => {
  return (
    <div>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"Create Requirements, update it, delete it"}
        title={"Create Requirements"}
      />
    </div>
  );
};

Tenders.layout = UserDashboard;
export default Tenders;
