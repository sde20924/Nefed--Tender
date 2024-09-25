import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React from "react";

const Tenders = () => {
  return (
    <div>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"View All Offerings"}
        title={"All Offerings"}
      />
    </div>
  );
};

Tenders.layout = UserDashboard;
export default Tenders;
