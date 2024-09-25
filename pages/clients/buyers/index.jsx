import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import ClientsTable from "@/components/Tables/ClientsTable";
import UserDashboard from "@/layouts/UserDashboard";
import { getAllManagerClients } from "@/store/slices/clientsSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ManagerBuyers = () => {
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
        title={"My Buyers"}
        subTitle={"View buyers. login as buyers"}
      />

      <ClientsTable
        loginBtnRoute={"manager/switch-user/buyer"}
        users={clients?.buyers}
      />
    </div>
  );
};
ManagerBuyers.layout = UserDashboard;
export default ManagerBuyers;
