import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaBan, FaTrash } from "react-icons/fa";
import ConfirmationDialog from "../DialogBox/DialogBox";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import DataNotAvailable from "../DataNotAvailable/DataNotAvailable";
import { callApiGet } from "@/utils/FetchApi";
import { useDispatch, useSelector } from "react-redux";
import {
  blockSeller,
  deleteSeller,
  updateMSGSeller,
} from "@/store/slices/sellerSlice";
import LoginButton from "../Buttons/LoginButton";

const UserTableForSeller = ({ users }) => {
  const router = useRouter();
  const [isDialogOpenDlt, setIsDialogOpenDlt] = useState(false);
  const [isDialogOpenBlc, setIsDialogOpenBlc] = useState(false);
  const [idToDeleteBlock, setIdForDeleteBlock] = useState(null);
  const dispatch = useDispatch();
  const { delete_success, s_msg, block_success } = useSelector(
    (state) => state.sellers
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
      blockSeller({
        user_id: idToDeleteBlock,
        type: "seller",
        operation: "block",
      })
    );
  };
  //handle delete
  const handleDelete = async () => {
    dispatch(
      deleteSeller({
        user_id: idToDeleteBlock,
        type: "seller",
        operation: "delete",
      })
    );
  };

  useEffect(() => {
    if (delete_success !== null) {
      if (delete_success) {
        alert(s_msg);
        closeDialog();
        setIdForDeleteBlock(null);
        dispatch(updateMSGSeller());
      } else {
        alert(s_msg);
        closeDialog();
        dispatch(updateMSGSeller());
      }
    }
  }, [delete_success]);

  useEffect(() => {
    if (block_success !== null) {
      if (block_success) {
        alert(s_msg);
        closeDialog();
        setIdForDeleteBlock(null);
        dispatch(updateMSGSeller());
      } else {
        alert(s_msg);
        closeDialog();
        dispatch(updateMSGSeller());
      }
    }
  }, [block_success]);

  if (!users) {
    return <LoadingScreen />;
  }
  if (users.length === 0) {
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
              <td className="">{user.email}</td>
              <td className="py-2 px-4">{user.phone_number}</td>
              {/* <td className="">{user.lastLogin}</td> */}
              <td className="py-2 px-4">
                <LoginButton
                  api_route={"admin/switch-user/seller"}
                  user_id={user.user_id}
                />
              </td>
              <td className="py-2 px-4 flex gap-2">
                <FaEye
                  onClick={() =>
                    router.push({
                      pathname: `sellers/${user.user_id}`,
                    })
                  }
                  color="green"
                  className="cursor-pointer"
                />
                <FaEdit
                  onClick={() =>
                    router.push({
                      pathname: `sellers/${user.user_id}`,
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
          desc: "Do you confirm want to block this seller ?",
        }}
      />
      {/* Dialog For Delete */}
      <ConfirmationDialog
        okPress={handleDelete}
        isOpen={isDialogOpenDlt}
        onClose={closeDialog}
        data={{
          title: "Confirmation message",
          desc: "Do you confirm want to delete this seller ?",
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

export default UserTableForSeller;
