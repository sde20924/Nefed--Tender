import UserDropdownTags from "@/components/Dropdowns/UserDropDownTags";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import UserTable from "@/components/Tables/AllBuyersInTag";
import UserDashboard from "@/layouts/UserDashboard";
import { callApi, callApiGet } from "@/utils/FetchApi";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const TagDetails = () => {
  const [allBuyers, setAllBuyers] = useState(null);
  const [allRegularBuyer, setAllRegularBuyer] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const router = useRouter();
  const { id } = router.query;

  const getAllBuyers = async () => {
    console.log(id);
    const data = await callApiGet(`admin/get-buyers-by-tag-id/${+id}`);
    if (data.success) {
      setAllBuyers(data.buyers);
    } else {
      if (data.msg === "No buyers found for the given tag_id") {
        setAllBuyers([]);
      }
    }
    console.log("Buyer", data);
  };

  const getAllRegularBuyers = async () => {
    const data = await callApiGet(`admin/get-buyers-by-tag-id/${2}`);
    if (data.success) {
      setAllRegularBuyer(data.buyers);
    } else {
      if (data.msg === "No buyers found for the given tag_id") {
        setAllRegularBuyer([]);
      }
    }
    console.log("Regular", data);
  };

  const handleDeleteUsers = async (idsToDelete) => {
    const data = await callApi("admin/update-tag-for-user", "POST", {
      user_ids: idsToDelete,
      type: "buyer",
      tag_id: 2,
    });

    if (data.success) {
      setAllBuyers((prevUsers) =>
        prevUsers.filter((user) => !idsToDelete.includes(user.user_id))
      );
      setAllRegularBuyer([...allRegularBuyer, ...data.updatedUsers]);
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
      type: "buyer",
      tag_id: +id,
    });

    if (data.success) {
      setAllRegularBuyer((prevUsers) =>
        prevUsers.filter((user) => !selectedUserIds.includes(user.user_id))
      );
      setAllBuyers([...allBuyers, ...data.updatedUsers]);
      setSelectedUserIds([]);
      alert(data.msg);
    } else {
      alert(data.msg);
    }
  };

  useEffect(() => {
    if (id) {
      console.log("useEffect");
      getAllBuyers();
      getAllRegularBuyers();
    }
  }, [id]);

  if (!allBuyers || !allRegularBuyer) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-4">
      <HeaderTitle
        title={`All Buyers In '${localStorage.getItem("tag_name")}' Tag`}
        subTitle={"View buyers, add buyers & remove buyers"}
      />
      <div className={`container mx-auto p-4 ${id === "2" && "hidden"}`}>
        <UserDropdownTags
          data={allRegularBuyer}
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
            Add Buyers
          </button>
        )}
      </div>
      <UserTable
        data={allBuyers}
        totalCount={allBuyers.length}
        pageSize={15}
        onDelete={handleDeleteUsers}
        regular={id === "2" ? true : false}
      />
    </div>
  );
};
TagDetails.layout = UserDashboard;
export default TagDetails;
