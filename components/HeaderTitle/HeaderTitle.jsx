import React from "react";

const HeaderTitle = ({ title, subTitle, padding, showSearch = false, searchTerm, handleSearchChange }) => {
  return (
    <div className={`w-full ${padding}`}>
      <div className="w-full bg-white shadow-md rounded p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm">{subTitle}</p>
        </div>
        {showSearch && (
          <input
            type="text"
            placeholder="Search by vessel name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded-lg p-2 w-1/5"
          />
        )}
      </div>
    </div>
  );
};

export default HeaderTitle;
