import React, { useState } from "react";
import { FaTrash } from "react-icons/fa"; // Import trash icon
import { usePagination, DOTS } from "@/hooks/usePagination"; // Import custom pagination hook
import DataNotAvailable from "../DataNotAvailable/DataNotAvailable";

const UserTable = ({ data, totalCount, pageSize, onDelete, regular }) => {
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount: 1,
    pageSize,
  });

  const currentPageData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(currentPageData.map((user) => user.user_id));
    } else {
      setSelected(
        selected.filter(
          (id) => !currentPageData.some((user) => user.user_id === id)
        )
      );
    }
  };

  const handleSelect = (userId) => {
    if (selected.includes(userId)) {
      setSelected(selected.filter((id) => id !== userId));
    } else {
      setSelected([...selected, userId]);
    }
  };

  const handleDelete = () => {
    onDelete(selected);
    setSelected([]);
  };
  if (!data || data.length === 0) {
    return <DataNotAvailable />;
  }
  return (
    <div className="container mx-auto p-4 mt-4">
       
        <button
          className={`mb-4 bg-${selected.length === 0 ? 'gray' : 'red'}-500 text-white px-4 py-2 rounded flex items-center cursor-${selected.length === 0 ? 'not-allowed' : 'pointer'}`}
          onClick={handleDelete}
          disabled={selected.length === 0}
        >
          <FaTrash className="mr-2" /> Remove
        </button>
      
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className={`border px-4 py-2 text-left ${regular && "hidden"}`}>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={currentPageData.every((user) =>
                  selected.includes(user.user_id)
                )}
              />
            </th>
            <th className="border px-4 py-2 text-left">User ID</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Phone</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((user) => (
            <tr key={user.user_id} className="hover:bg-gray-100">
              <td className={`border px-4 py-2 ${regular && "hidden"}`}>
                <input
                  type="checkbox"
                  checked={selected.includes(user.user_id)}
                  onChange={() => handleSelect(user.user_id)}
                />
              </td>
              <td className="border px-4 py-2">{user.user_id}</td>
              <td className="border px-4 py-2">
                {user.first_name} {user.last_name}
              </td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <span key={index} className="mx-1">
                ...
              </span>
            );
          }

          return (
            <button
              key={index}
              className={`mx-1 px-3 py-1 border rounded ${
                currentPage === pageNumber
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserTable;
