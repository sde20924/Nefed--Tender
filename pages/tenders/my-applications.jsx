import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from Next.js
import { callApiGet } from "../../utils/FetchApi";

const MyApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await callApiGet("/tender-applications"); // Use the correct API endpoint
        setApplications(data.data); // Set the retrieved data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Function to handle redirection to tender details page
  const handleViewDetails = (tenderId) => {
    router.push(`/tenders/${tenderId}`); // Redirect to the tender details page
  };

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"My Applications, set visibility etc."}
        title={"My Applications"}
      />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Tender Applications</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.length > 0 ? (
            applications.map((application) => ( 
              <div
                key={application.tender_application_id}
                className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200"
              >
                <h2 className="text-xl font-semibold mb-2">Tender ID: {application.tender_id}</h2>
                <h3>Tender Name : {application.tender_title}</h3>
                <p className="text-gray-700 mb-4">
                  Status:{" "}
                  <span
                    className={`font-bold ${
                      application.status === "accepted"
                        ? "text-green-500"
                        : application.status === "rejected"
                        ? "text-red-500"
                        : application.status === "Submitted"
                        ? "text-blue-500" // Show "Submitted" status in green
                        : "text-yellow-500"
                    }`}
                  >
                    {application.status}
                  </span>
                </p>
                {/* Display rejected reason if the status is 'rejected' */}
                {application.status === "rejected" && (
                  <p>
                    Reason for Rejection: <span className="text-red-500">{application.rejected_reason}</span>
                  </p>
                )}
                {/* Button centered at the bottom of the card */}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handleViewDetails(application.tender_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    View Tender Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No applications found.</p>
          )}
        </div>
      </div>
    </>
  );
};

MyApplication.layout = UserDashboard;
export default MyApplication;
