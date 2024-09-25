import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaBan, FaTrash } from "react-icons/fa";
import ConfirmationDialog from "../DialogBox/DialogBox";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import DataNotAvailable from "../DataNotAvailable/DataNotAvailable";
import { useDispatch, useSelector } from "react-redux";
import { blockBuyer, deleteBuyer, updateMSG } from "@/store/slices/buyersSlice";
import LoginButton from "../Buttons/LoginButton";

const UserTable = ({ users }) => {
  const router = useRouter();
  const [isDialogOpenDlt, setIsDialogOpenDlt] = useState(false);
  const [isDialogOpenBlc, setIsDialogOpenBlc] = useState(false);
  const [idToDeleteBlock, setIdForDeleteBlock] = useState(null);
  const dispatch = useDispatch();
  const { delete_success, b_msg, block_success } = useSelector(
    (state) => state.buyers
  );

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users && users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users && users.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //Dialog code
  const openDialogForBlockBtn = () => {
    setIsDialogOpenBlc(true);
  };
  const openDialogForDeleteBtn = () => {
    setIsDialogOpenDlt(true);
  };

  const closeDialog = () => {
    setIsDialogOpenDlt(false);
    setIsDialogOpenBlc(false);
  };

  //handle block
  const handleBlock = async () => {
    dispatch(
      blockBuyer({
        user_id: idToDeleteBlock,
        type: "buyer",
        operation: "block",
      })
    );
  };
  //handle delete
  const handleDelete = async () => {
    dispatch(
      deleteBuyer({
        user_id: idToDeleteBlock,
        type: "buyer",
        operation: "delete",
      })
    );
  };

  useEffect(() => {
    if (delete_success !== null) {
      if (delete_success) {
        alert(b_msg);
        closeDialog();
        setIdForDeleteBlock(null);
        dispatch(updateMSG());
      } else {
        alert(b_msg);
        closeDialog();
        dispatch(updateMSG());
      }
    }
  }, [delete_success]);

  useEffect(() => {
    if (block_success !== null) {
      if (block_success) {
        alert(b_msg);
        closeDialog();
        setIdForDeleteBlock(null);
        dispatch(updateMSG());
      } else {
        alert(b_msg);
        closeDialog();
        dispatch(updateMSG());
      }
    }
  }, [block_success]);

  if (!users) {
    return <LoadingScreen />;
  }
  if (users?.length === 0) {
    return <DataNotAvailable />;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full bg-white">
        <thead style={{ background: "#161e29", color: "white" }}>
          <tr>
            <th className="text-left py-2 px-4">#</th>
            <th className="text-left py-2 px-4">Name</th>
            <th className="text-left py-2 px-4">Email</th>
            <th className="text-left py-2 px-4">Phone</th>
            {/* <th className="text-left py-2 px-4">Last Login</th> */}
            <th className="text-left py-2 px-4">Login</th>
            <th className="text-left py-2 px-4">Action</th>
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
              {/* <td className="">{user.lastLogin}</td> */}
              <td className="py-2 px-4">
                <LoginButton
                  api_route={"admin/switch-user/buyer"}
                  user_id={user.user_id}
                />
              </td>
              <td className="py-2 px-4 flex gap-2">
                <FaEye
                  onClick={() =>
                    router.push({
                      pathname: `buyers/${user.user_id}`,
                    })
                  }
                  color="green"
                  className="cursor-pointer"
                />
                <FaEdit
                  onClick={() =>
                    router.push({
                      pathname: `buyers/${user.user_id}`,
                      query: { edit: true },
                    })
                  }
                  color="orange"
                  className="cursor-pointer"
                />
                <FaBan
                  onClick={() => {
                    setIdForDeleteBlock(user.user_id);
                    openDialogForBlockBtn();
                  }}
                  color="red"
                  className="cursor-pointer"
                />
                <FaTrash
                  onClick={() => {
                    setIdForDeleteBlock(user.user_id);
                    openDialogForDeleteBtn();
                  }}
                  color="red"
                  className="cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationDialog
        okPress={handleBlock}
        isOpen={isDialogOpenBlc}
        onClose={closeDialog}
        data={{
          title: "Confirmation message",
          desc: "Do you confirm want to block this user ?",
        }}
      />
      {/* Dialog For Delete */}
      <ConfirmationDialog
        okPress={handleDelete}
        isOpen={isDialogOpenDlt}
        onClose={closeDialog}
        data={{
          title: "Confirmation message",
          desc: "Do you confirm want to delete this user ?",
        }}
      />
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

export default UserTable;
