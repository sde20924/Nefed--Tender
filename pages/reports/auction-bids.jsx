import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import TenderSelect from "@/components/TenderSelectList/TenderSelect"; // Import TenderSelect component
import { callApiGet } from "@/utils/FetchApi";
import { useState } from "react";

const AuctionBids = () => {
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
      <div className="container m-4 p-4 bg-white shadow-md rounded-md w-auto">
        <div className="mb-6 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {selectedTender && (
                <span className="text-lg font-semibold">
                  Auction Bids for: {selectedTender}
                </span>
              )}
            </div>
            {/* Use TenderSelect component */}
            <TenderSelect
              selectedTender={selectedTender}
              onChange={handleTenderChange}
            />
          </div>
        </div>

        {loadingBids && <p>Loading auction bids...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto mt-4">
          <div className="p-4 bg-gray-50 rounded-md shadow-md">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-center">Sno</th>
                  <th className="px-4 py-2 border-b text-center">#</th>
                  <th className="px-4 py-2 border-b">User</th>
                  <th className="px-4 py-2 border-b">Company Name</th>
                  <th className="px-4 py-2 border-b text-right">Amount</th>
                  <th className="px-4 py-2 border-b text-right">FOB</th>
                  <th className="px-4 py-2 border-b text-right">Freight</th>
                  <th className="px-4 py-2 border-b text-center">Status</th>
                  <th className="px-4 py-2 border-b text-right">Round</th>
                  <th className="px-4 py-2 border-b text-right">Qty</th>
                  <th className="px-4 py-2 border-b text-right">Bided At</th>
                </tr>
              </thead>
              <tbody>
                {!loadingBids && bids.length === 0 && (
                  <tr>
                    <td colSpan="11" className="text-center py-4 text-gray-500">
                      No data record found.{" "}
                      <span className="text-blue-400">Select Tender</span>
                    </td>
                  </tr>
                )}
                {bids.length > 0 &&
                  bids.map((bid, index) => {
                    const [bidDate, bidTime] = bid.created_at.split("T");
                    return (
                      <tr
                        key={bid.bid_id}
                        className="hover:bg-gray-100 transition-all duration-200"
                      >
                        <td className="border-t px-6 py-3 text-center">
                          {index + 1}
                        </td>
                        <td className="border-t px-6 py-3 text-center">
                          #{bid.user_id}
                        </td>
                        <td className="border-t px-6 py-3">{`${bid.first_name} ${bid.last_name}`}</td>
                        <td className="border-t px-6 py-3">{bid.company_name}</td>
                        <td className="border-t px-6 py-3 text-right">
                          $
                          {bid.bid_amount
                            ? Number(bid.bid_amount).toFixed(2)
                            : "--"}
                        </td>

                        <td className="border-t px-6 py-3 text-right">
                          $
                          {bid.fob_amount
                            ? Number(bid.fob_amount).toFixed(2)
                            : "--"}
                        </td>

                        <td className="border-t px-6 py-3 text-right">
                          $
                          {bid.freight_amount
                            ? Number(bid.freight_amount).toFixed(2)
                            : "--"}
                        </td>

                        <td className="border-t px-6 py-3 text-center">
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
                        <td className="border-t px-6 py-3 text-right">
                          {bid.round || "--"}
                        </td>
                        <td className="border-t px-6 py-3 text-right">
                          {bid.qty_secured || "--"}
                        </td>
                        <td className="border-t px-6 py-3 text-right">
                          {bidDate} - {bidTime.split(".")[0]}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

AuctionBids.layout = UserDashboard;
export default AuctionBids;
