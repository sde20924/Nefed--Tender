import protectAuthRoute from "@/components/CheckAuth/ProtectAuthRoute";
import FooterSmall from "@/components/Footers/FooterSmall";
import Navbar from "@/components/Navbars/IndexNavbar";
import React from "react";

// components

function Auth({ children }) {
  return (
    <>
      <Navbar transparent />
      <main style={{ background: "#1e293b" }}>
        <section className="relative w-full h-full py-40 min-h-screen">
          {children}
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
export default protectAuthRoute(Auth);
