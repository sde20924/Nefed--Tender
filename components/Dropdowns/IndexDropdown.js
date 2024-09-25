import React from "react";
import Link from "next/link";
import { createPopper } from "@popperjs/core";

const IndexDropdown = ({
  options,
  isOpen,
  onToggle,
  closeOtherDropdowns,
  closeNavbar,
}) => {
  const btnDropdownRef = React.useRef();
  const popoverDropdownRef = React.useRef();

  React.useEffect(() => {
    if (isOpen) {
      createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: "bottom-start",
      });
    }
  }, [isOpen]);

  const handleToggle = (e) => {
    e.preventDefault();
    if (!isOpen) closeOtherDropdowns(); // Close other dropdowns if opening this one
    onToggle();
    // Toggle this dropdown
  };

  return (
    <>
      <button
        style={{ borderRadius: "8px" }}
        className="hover:text-blueGray-500 border text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
        ref={btnDropdownRef}
        onClick={handleToggle}
      >
        {options.btnName}
      </button>
      <div
        ref={popoverDropdownRef}
        className={
          (isOpen ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        {/* <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
          }
        >
          {options.btnName} options
        </span> */}
        {options.menus.map((ele, idx) => (
          <Link
            key={idx}
            className={
              "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
            }
            href={`${ele.href}`}
            onClick={() => {
              closeOtherDropdowns();
              closeNavbar();
            }}
          >
            {ele.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default IndexDropdown;
