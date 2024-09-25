import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React from "react";

const Tenders = () => {
  return (
    <div>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"View All Requirements"}
        title={"All Requirements"}
      />
    </div>
  );
};

Tenders.layout = UserDashboard;
export default Tenders;
