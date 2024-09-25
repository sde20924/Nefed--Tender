import UserDropdownTags from "@/components/Dropdowns/UserDropDownTags";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import UserTable from "@/components/Tables/AllBuyersInTag";
import UserDashboard from "@/layouts/UserDashboard";
import { callApi, callApiGet } from "@/utils/FetchApi";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const TagDetails = () => {
  const [allSellers, setAllSellers] = useState(null);
  const [allRegularSellers, setAllRegularSellers] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const router = useRouter();
  const { id } = router.query;

  const getAllSellers = async () => {
    console.log(id);
    const data = await callApiGet(`admin/get-sellers-by-tag-id/${+id}`);
    if (data.success) {
      setAllSellers(data.sellers);
    } else {
      if (data.msg === "No sellers found for the given tag_id") {
        setAllSellers([]);
      }
    }
    console.log("Seller", data);
  };

  const getAllRegularSellers = async () => {
    const data = await callApiGet(`admin/get-sellers-by-tag-id/${1}`);
    if (data.success) {
      setAllRegularSellers(data.sellers);
    } else {
      if (data.msg === "No sellers found for the given tag_id") {
        setAllRegularSellers([]);
      }
    }
    console.log("Seller Regular", data);
  };

  const handleDeleteUsers = async (idsToDelete) => {
    const data = await callApi("admin/update-tag-for-user", "POST", {
      user_ids: idsToDelete,
      type: "seller",
      tag_id: 1,
    });

    if (data.success) {
      setAllSellers((prevUsers) =>
        prevUsers.filter((user) => !idsToDelete.includes(user.user_id))
      );
      setAllRegularSellers([...allRegularSellers, ...data.updatedUsers]);
      alert(data.msg);
    } else {
      alert(data.msg);
    }
  };

  const handleSelectUsers = (userIds) => {
    setSelectedUserIds(userIds);
    console.log("Selected User IDs:", userIds);
  };

  const handleAddUsers = async () => {
    const data = await callApi("admin/update-tag-for-user", "POST", {
      user_ids: selectedUserIds,
      type: "seller",
      tag_id: +id,
    });

    if (data.success) {
      setAllRegularSellers((prevUsers) =>
        prevUsers.filter((user) => !selectedUserIds.includes(user.user_id))
      );
      setAllSellers([...allSellers, ...data.updatedUsers]);
      setSelectedUserIds([]);
      alert(data.msg);
    } else {
      alert(data.msg);
    }
  };

  useEffect(() => {
    if (id) {
      console.log("useEffect");
      getAllSellers();
      getAllRegularSellers();
    }
  }, [id]);

  if (!allSellers || !allRegularSellers) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-4">
      <HeaderTitle
        title={`All Sellers In '${localStorage.getItem('tag_name')}' Tag`}
        subTitle={"View sellers, add sellers & remove sellers"}
      />
      <div className={`container mx-auto p-4 ${id === "1" && "hidden"}`}>
        <UserDropdownTags
          data={allRegularSellers}
          selected={selectedUserIds}
          onSelect={handleSelectUsers}
        />
        {selectedUserIds.length > 0 && (
          <div>{selectedUserIds.length} user selected</div>
        )}
        {selectedUserIds.length > 0 && (
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddUsers}
          >
            Add Sellers
          </button>
        )}
      </div>
      <UserTable
        data={allSellers}
        totalCount={allSellers.length}
        pageSize={15}
        onDelete={handleDeleteUsers}
        regular={id === "1" ? true : false}
      />
    </div>
  );
};
TagDetails.layout = UserDashboard;
export default TagDetails;
