import React from "react";

import AdminNavbar from "@/components/Navbars/AdminNavbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import FooterAdmin from "@/components/Footers/FooterAdmin";
import withAuth from "@/components/CheckAuth/WithAuth";

function UserDashboard({ children }) {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <div style={{ minHeight: "84vh" }}>{children}</div>
        <FooterAdmin />
      </div>
    </>
  );
}
export default withAuth(UserDashboard);
