import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { callApiGet } from "../../utils/FetchApi";

const MyTender = () => {
  const [applications, setApplications] = useState([]);
  const [tenderDetails, setTenderDetails] = useState({});
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("active"); // Tabs state
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await callApiGet("/tender-applications");
        const acceptedApplications = data.data.filter(
          (app) => app.status === "accepted"
        );

        await fetchTenderDetails(acceptedApplications);

        setApplications(acceptedApplications);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchTenderDetails = async (applications) => {
      try {
        const tendersData = await Promise.all(
          applications.map(async (application) => {
            const tenderData = await callApiGet(
              `/tender/${application.tender_id}`
            );
            calculateTimeLeft(
              tenderData.data.auct_start_time,
              tenderData.data.auct_end_time,
              application.tender_id
            );
            return { tenderId: application.tender_id, data: tenderData.data };
          })
        );

        const tendersDict = {};
        tendersData.forEach((tender) => {
          tendersDict[tender.tenderId] = tender.data;
        });

        setTenderDetails(tendersDict);
      } catch (error) {
        console.error("Error fetching tender details:", error.message);
      }
    };

    fetchApplications();
  }, []);

  const calculateTimeLeft = (auctStartTime, auctEndTime, tenderId) => {
    const startTimeMs = auctStartTime * 1000;
    const endTimeMs = auctEndTime * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      let timeLeft, label;

      if (now < startTimeMs) {
        timeLeft = startTimeMs - now;
        label = "Starting At";
      } else if (now >= startTimeMs && now <= endTimeMs) {
        timeLeft = endTimeMs - now;
        label = "Closing At";
      } else {
        clearInterval(interval);
        timeLeft = 0;
        label = "Expired";
      }

      if (timeLeft > 0) {
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        setTimeLeft((prevState) => ({
          ...prevState,
          [tenderId]: {
            label,
            time: `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
          },
        }));
      } else {
        setTimeLeft((prevState) => ({
          ...prevState,
          [tenderId]: {
            label,
            time: "Expired",
          },
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const handleViewDetails = (tenderId) => {
    router.push(`/tenders/accessBidRoom?tenderId=${tenderId}`);
  };

  // Tab navigation logic
  const filteredApplications = applications.filter((application) => {
    const tender = tenderDetails[application.tender_id];
    const timeInfo = timeLeft[application.tender_id];
    if (activeTab === "active") {
      return timeInfo && timeInfo.label !== "Expired";
    }
    if (activeTab === "expired") {
      return timeInfo && timeInfo.label === "Expired";
    }
    return true;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"My Tenders, set visibility etc."}
        title={"My tenders"}
      />

      <div className="container mx-auto p-4">
        {/* Navigation tabs */}
        <div className="mb-6 flex space-x-4 border-b">
          <button
            className={`pb-2 text-lg ${
              activeTab === "active" ? "border-blue-500 border-b-2 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Auctions
          </button>
          <button
            className={`pb-2 text-lg ${
              activeTab === "expired" ? "border-blue-500 border-b-2 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("expired")}
          >
            Expired Auctions
          </button>
        </div>

        {/* Tender Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => {
              const tender = tenderDetails[application.tender_id];
              const timeInfo = timeLeft[application.tender_id];

              return (
                <div
                  key={application.tender_application_id}
                  className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200"
                >
                  {tender && (
                    <>
                      <h2 className="text-lg font-semibold mb-2">
                        {tender.tender_title}
                      </h2>
                      <div className="flex items-center text-gray-500 mb-2">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        <span className="whitespace-nowrap">
                          {new Date(tender.auct_start_time * 1000).toLocaleString()} -{" "}
                          {new Date(tender.auct_end_time * 1000).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 mb-2">
                        <i className="fas fa-box mr-2"></i>
                        <span>{tender.qty} Qty</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Round 1</p>

                      {/* Countdown Timer - only show if the auction is not expired */}
                      {timeInfo?.label !== "Expired" && (
                        <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded-lg mb-4 flex justify-between items-center">
                          <span className="flex items-center">
                            <i className="fas fa-clock mr-2"></i>
                            {timeInfo ? timeInfo.label : "Starting At"}
                          </span>
                          <span className="font-bold text-lg">
                            {timeInfo ? timeInfo.time : "Expired"}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Access Bid Room Button */}
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => handleViewDetails(application.tender_id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Access Bid Room
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">
              {activeTab === "active"
                ? "No active auctions found."
                : "No expired auctions found."}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

MyTender.layout = UserDashboard;
export default MyTender;
