import DataNotAvailable from "@/components/DataNotAvailable/DataNotAvailable";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import UserDashboard from "@/layouts/UserDashboard";
import { callApiGet } from "@/utils/FetchApi";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const user = {
  id: 1,
  name: "Alice",
  lastName: "Johnson",
  companyName: "TechCorp",
  email: "alice.johnson@techcorp.com",
  phone: "123-456-7890",
  gstNo: "27AACCT0204G1Z9",
  pan: "ABCDE1234F",
  registrationNo: "1234567890",
};

const ManagersDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [managerDetails, setManagerDetails] = useState(null);

  const getManagerdetails = async () => {
    const data = await callApiGet(`get-manager/${id}`);
    console.log(data);
    if (data.success) {
      if (data.data) {
        setManagerDetails(data.data);
      } else {
        setManagerDetails([]);
      }
    } else {
      if (data.msg === "Manager not found") {
        setManagerDetails([]);
      }
      alert(data.msg);
    }
  };

  useEffect(() => {
    if (id) {
      getManagerdetails();
    }
  }, [id]);

  if (!managerDetails) {
    return <LoadingScreen />;
  }
  if (managerDetails.length === 0) {
    return <DataNotAvailable />;
  }
  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        title={"Manager Details"}
        subTitle={"View manager info"}
      />
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Personal Information
            </h3>
            <div className="border p-4 rounded-lg shadow-sm bg-gray-50 mt-2">
              <p className="text-gray-600">
                <strong>Name:</strong> {managerDetails.first_name}{" "}
                {managerDetails.last_name}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {managerDetails.email}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {managerDetails.phone_number}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Company Information
            </h3>
            <div className="border p-4 rounded-lg shadow-sm bg-gray-50 mt-2">
              <p className="text-gray-600">
                <strong>Company Name:</strong> {managerDetails?.company_name}
              </p>
              <p className="text-gray-600">
                <strong>GST Number:</strong> {managerDetails?.gst_number}
              </p>
              {managerDetails?.pan_number && (
                <p className="text-gray-600">
                  <strong>PAN Number:</strong> {managerDetails?.pan_number}
                </p>
              )}
              <p className="text-gray-600">
                <strong>Registration Number:</strong>{" "}
                {managerDetails?.registration_number}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ManagersDetails.layout = UserDashboard;
export default ManagersDetails;
