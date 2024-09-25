import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React, { useEffect, useState, useRef } from "react";
import { callApiGet } from "@/utils/FetchApi";
import { useRouter } from "next/router";

const ExploreTender = () => {
  const [tenders, setTenders] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const router = useRouter();
  const intervalIdsRef = useRef({}); // Reference to store interval IDs

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const data = await callApiGet("/tenders/active");
        setTenders(data.data);

        // Initialize time left for each tender and set intervals
        data.data.forEach((tender) => {
          const initialTime = calculateTimeLeft(
            tender.tender_id,
            tender.app_end_time
          );
          setTimeLeft((prevTimeLeft) => ({
            ...prevTimeLeft,
            [tender.tender_id]: initialTime,
          }));

          // Set interval for each tender using its unique ID
          if (!intervalIdsRef.current[tender.tender_id]) {
            const intervalId = setInterval(() => {
              updateTenderTimeLeft(tender.tender_id, tender.app_end_time);
            }, 1000);
            intervalIdsRef.current[tender.tender_id] = intervalId;
          }
        });
      } catch (error) {
        console.error("Error fetching tenders:", error.message);
      }
    };

    fetchTenders();

    // Cleanup intervals on component unmount
    return () => {
      Object.values(intervalIdsRef.current).forEach(clearInterval);
    };
  }, []);

  // Function to calculate the countdown timer for a given end time
  const calculateTimeLeft = (tenderId, auctEndTime) => {
    const timeLeft = auctEndTime * 1000 - new Date().getTime();
    if (timeLeft > 0) {
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      clearInterval(intervalIdsRef.current[tenderId]); // Clear interval if countdown ends
      delete intervalIdsRef.current[tenderId]; // Clean up reference
      return "00:00:00";
    }
  };

  // Update time left for a specific tender
  const updateTenderTimeLeft = (tenderId, auctEndTime) => {   
    const newTimeLeft = calculateTimeLeft(tenderId, auctEndTime);

    // Update the time left state without removing the tender card
    setTimeLeft((prevTimeLeft) => ({
      ...prevTimeLeft,
      [tenderId]: newTimeLeft,
    }));
  };

  const handleApplyNow = (tenderId) => {
    router.push(`/tenders/${tenderId}`);
  };

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"Available tenders, set visibility etc."}
        title={"Available tenders"}
      />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-lightBlue-500">
          Active Tenders
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenders.map((tender) => (
            <div
              key={tender.tender_id}
              className="bg-white p-4 rounded-lg shadow-md max-w-sm mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">
                {tender.tender_title}
              </h2>
              <p className="text-sm text-gray-500 flex items-center mt-2 mb-6">
                <i className="far fa-calendar-alt mr-2"></i>
                Open Till:{" "}
                {new Date(tender.app_end_time * 1000).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <div className="bg-yellow-100 rounded-lg p-2 mt-2 flex items-center justify-between mb-4">
                <i className="fas fa-clock text-yellow-400 mr-2"></i>
                <span className="text-sm font-medium">Closing At</span>
                <span className="font-bold">
                  {timeLeft[tender.tender_id] || "00:00:00"}
                </span>
              </div>
              <button
                onClick={() => handleApplyNow(tender.tender_id)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-4 w-full"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

ExploreTender.layout = UserDashboard;
export default ExploreTender;
