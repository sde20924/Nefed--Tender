import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import ClientsTable from "@/components/Tables/ClientsTable";
import UserDashboard from "@/layouts/UserDashboard";
import { getAllManagerClients } from "@/store/slices/clientsSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ManagerAdmins = () => {
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
        title={"My admins"}
        subTitle={"View admins. login as admin"}
      />

      <ClientsTable
        loginBtnRoute={"manager/switch-user/admin"}
        users={clients?.admins}
      />
    </div>
  );
};
ManagerAdmins.layout = UserDashboard;
export default ManagerAdmins;
