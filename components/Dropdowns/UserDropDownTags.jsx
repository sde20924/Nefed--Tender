import React, { useState, useEffect, useRef  } from "react";
import { FaSearch, FaCheck } from "react-icons/fa";

const UserDropdownTags = ({ data, onSelect, selected }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  //const [selected, setSelected] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setFilteredData(
      data.filter((user) =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelect(filteredData.map((user) => user.user_id));
    } else {
      onSelect([]);
    }
  };

  const handleSelect = (userId) => {
    if (selected.includes(userId)) {
      onSelect(selected.filter((id) => id !== userId));
    } else {
      onSelect([...selected, userId]);
    }
  };

  const handleApplySelection = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-80" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full bg-gray-300 p-2 rounded"
      >
        Select Users
      </button>
      {isDropdownOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
          <div className="p-2">
            <div className="flex items-center mb-2">
              <FaSearch className="mr-2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  filteredData.length > 0 &&
                  selected.length === filteredData.length
                }
                className="mr-2"
              />
              <span>Select All</span>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {filteredData.map((user) => (
                <div key={user.user_id} className="flex items-center p-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(user.user_id)}
                    onChange={() => handleSelect(user.user_id)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-bold">{user.first_name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleApplySelection}
              className="w-full bg-blue-500 text-white p-2 rounded mt-2"
            >
              Apply Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdownTags;
