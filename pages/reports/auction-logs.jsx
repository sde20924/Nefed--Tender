import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import TenderSelect from "@/components/TenderSelectList/TenderSelect"; // Import TenderSelect component
import { callApiGet } from "@/utils/FetchApi";
import { useState } from "react";

const AuctionLogs = () => {
  const [selectedTender, setSelectedTender] = useState("");
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [error, setError] = useState("");

  const fetchAuctionBids = async (selectedTender) => {
    setLoadingBids(true);
    try {
      const response = await callApiGet(`/tender-Auction-bids/${selectedTender}`);

      if (response && response.success) {
        setBids(response.allBids || []);
        setError("");
      } else {
        throw new Error("No bids found or failed to load bids");
      }
    } catch (error) {
      console.error("Error fetching auction bids:", error.message);
      setError("Failed to fetch bids. Please try again later.");
      setBids([]);
    } finally {
      setLoadingBids(false);
    }
  };

  const handleTenderChange = async (event) => {
    const tenderId = event.target.value;
    setSelectedTender(tenderId);
    if (tenderId) {
      await fetchAuctionBids(tenderId);
    }
  };

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"View tenders, update them, delete them"}
        title={"All Tenders"}
      />
      <div className="container m-4 w-auto p-4 bg-white shadow-md rounded-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold">
              Selected Tender ID: {selectedTender || "N/A"}
            </span>
          </div>
          <div className="ml-auto">
            {/* Use TenderSelect component */}
            <TenderSelect selectedTender={selectedTender} onChange={handleTenderChange} />
          </div>
        </div>

        {loadingBids && <p>Loading auction bids...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left text-sm uppercase text-gray-700 font-semibold border-b">
                <th className="px-6 py-4 text-center">Sno</th>
                <th className="px-6 py-4 text-center">ID</th>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4 text-right">Bid</th>
                <th className="px-6 py-4 text-right">Fob</th>
                <th className="px-6 py-4 text-right">Freight</th>
                <th className="px-6 py-4 text-right">Round</th>
                <th className="px-6 py-4 text-right">Bid Date</th>
                <th className="px-6 py-4 text-right">Bid Time</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              {!loadingBids && bids.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No data record found.  <span className="text-blue-400">Select Tender</span>
                  </td>
                </tr>
              )}
              {bids.length > 0 &&
                bids.map((bid, index) => {
                  const [bidDate, bidTime] = bid.created_at.split("T");
                  return (
                    <tr key={bid.bid_id} className="hover:bg-gray-100 transition-all duration-200">
                      <td className="border-t px-6 py-3 text-center">{index + 1}</td>
                      <td className="border-t px-6 py-3 text-center">#{bid.bid_id}</td>
                      <td className="border-t px-6 py-3">{`${bid.first_name} ${bid.last_name} (${bid.company_name})`}</td>
                      <td className="border-t px-6 py-3 text-right">
                        ${Number(bid.bid_amount).toFixed(2) || "--"}
                      </td>
                      <td className="border-t px-6 py-3 text-right">
                        ${Number(bid.fob_amount).toFixed(2) || "--"}
                      </td>
                      <td className="border-t px-6 py-3 text-right">
                        ${Number(bid.freight_amount).toFixed(2) || "--"}
                      </td>
                      <td className="border-t px-6 py-3 text-right">{bid.round || "--"}</td>
                      <td className="border-t px-6 py-3 text-right">{bidDate}</td>
                      <td className="border-t px-6 py-3 text-right">{bidTime.split(".")[0]}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

AuctionLogs.layout = UserDashboard;
export default AuctionLogs;
