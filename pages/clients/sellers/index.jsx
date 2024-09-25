import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import ClientsTable from "@/components/Tables/ClientsTable";
import UserDashboard from "@/layouts/UserDashboard";
import { getAllManagerClients } from "@/store/slices/clientsSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ManagerSellers = () => {
  const dispatch = useDispatch();
  const { clients } = useSelector((state) => state.clients);

  useEffect(() => {
    if (!clients) {
      dispatch(getAllManagerClients());
    }
  }, [clients]);
  return (
    <div className="p-4">
      <HeaderTitle
        title={"My Sellers"}
        subTitle={"View sellers. login as sellers"}
      />

      <ClientsTable
        loginBtnRoute={"manager/switch-user/seller"}
        users={clients?.sellers}
      />
    </div>
  );
};
ManagerSellers.layout = UserDashboard;
export default ManagerSellers;
