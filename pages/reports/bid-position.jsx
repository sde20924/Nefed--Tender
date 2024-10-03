import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import TenderSelect from "@/components/TenderSelectList/TenderSelect"; // Import the TenderSelect component
import { callApiGet } from "@/utils/FetchApi";
import { useState } from "react";

const BidPosition = () => {
  const [selectedTender, setSelectedTender] = useState("");
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [error, setError] = useState("");

  const fetchAuctionBids = async (tenderId) => {
    setLoadingBids(true);
    try {
      const response = await callApiGet(`/tender-Auction-bids/${tenderId}`);

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
      <div className="container m-4 w-auto p-6 bg-white shadow-md rounded-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1 text-lg font-semibold">
            {selectedTender && `Selected Tender ID: ${selectedTender}`}
          </div>
          <div className="flex items-center space-x-4">
            <TenderSelect
              selectedTender={selectedTender}
              onChange={handleTenderChange}
            />
          </div>
        </div>

        {loadingBids && <p>Loading auction bids...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center text-sm uppercase text-gray-700 font-semibold border-b">
                <th className="px-4 py-2 border-b">Sno</th>
                <th className="px-4 py-2 border-b">Appl ID</th>
                <th className="px-4 py-2 border-b">Company Name</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Bid Amt</th>
                <th className="px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {!loadingBids && bids.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No data record found.  
                     <span className="text-blue-400">Select Tender</span>
                  </td>
                </tr>
              )}
              {bids.length > 0 &&
                bids.map((bid, index) => {
                  const bidAmount = Number(bid.bid_amount).toFixed(2);
                  return (
                    <tr
                      key={bid.bid_id}
                      className="hover:bg-gray-100 transition-all duration-200 text-center"
                    >
                      <td className="border-t px-4 py-3">{index + 1}</td>
                      <td className="border-t px-4 py-3">{bid.bid_id || "--"}</td>
                      <td className="border-t px-4 py-3">{bid.company_name}</td>
                      <td className="border-t px-4 py-3">{`${bid.first_name} ${bid.last_name}`}</td>
                      <td className="border-t px-4 py-3">${bidAmount}</td>
                      <td className="border-t px-4 py-3">
                        <span
                          className={`px-4 py-1 inline-block text-sm leading-5 font-semibold rounded-full min-w-[80px] text-center ${
                            bid.bid_status === "sold"
                              ? "bg-green-500 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {bid.bid_status
                            ? bid.bid_status.charAt(0).toUpperCase() +
                              bid.bid_status.slice(1)
                            : "--"}
                        </span>
                      </td>
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

BidPosition.layout = UserDashboard;
export default BidPosition;
