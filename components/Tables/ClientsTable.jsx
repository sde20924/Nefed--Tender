import { useRouter } from "next/router";
import { useState } from "react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import DataNotAvailable from "../DataNotAvailable/DataNotAvailable";
import LoginButton from "../Buttons/LoginButton";

const ClientsTable = ({ users, loginBtnRoute }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users && users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users && users.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!users) {
    return <LoadingScreen />;
  }
  if (users.length === 0) {
    return <DataNotAvailable />;
  }

  return (
    <div className="w-full overflow-x-auto mt-4">
      <table className="w-full bg-white">
        <thead style={{ background: "#161e29", color: "white" }}>
          <tr>
            <th className="text-left py-2 px-4">#</th>
            <th className="text-left py-2 px-4">Name</th>
            <th className="text-left py-2 px-4">Email</th>
            <th className="text-left py-2 px-4">Phone</th>
            <th className="text-left py-2 px-4">Login</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.user_id} className="border-b">
              <td className="py-2 px-4">{indexOfFirstUser + index + 1}</td>
              <td className="py-2 px-4">
                {user.first_name} {user.last_name}
              </td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.phone_number}</td>
              <td className="py-2 px-4">
                <LoginButton
                  api_route={`${loginBtnRoute}`}
                  user_id={user.assigned_by}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClientsTable;
