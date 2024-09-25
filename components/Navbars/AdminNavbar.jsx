import React from "react";

import UserDropdown from "@/components/Dropdowns/UserDropdown";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const handleReloginClick = () => {
    const token = localStorage.getItem("token_a");
    const data = JSON.parse(localStorage.getItem("data_a"));
    localStorage.setItem("token", token);
    localStorage.setItem("data", JSON.stringify(data));

    localStorage.removeItem("token_a");
    localStorage.removeItem("data_a");
    router.push("/dashboard").then(() => {
      window.location.reload();
    });
  };
  const pathname = router.pathname;
  let newPathname = pathname.replace(/^\//, "");
  newPathname = newPathname.replace(/\/\[\w+\]/, " ");
  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 left-0 w-full z-10 bg-blueGray-800 md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <p className="text-white text-sm uppercase hidden lg:inline-block font-semibold">
            {newPathname.trim()}
          </p>
          {/* Form */}
          {/* <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">
              <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search here..."
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
              />
            </div>
          </form> */}
          {/* User */}
          <ul className="gap-4 flex-col md:flex-row list-none items-center hidden md:flex">
            <UserDropdown />
            <button
              onClick={handleReloginClick}
              className={`${
                JSON.parse(localStorage.getItem("data_a")) === null && "hidden"
              } bg-blue-500 text-white text-xs px-3 py-2 rounded`}
            >
              Relogin
            </button>
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
