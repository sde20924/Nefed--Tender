import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import TenderSelect from "@/components/TenderSelectList/TenderSelect"; // Import TenderSelect component
import { callApiGet } from "@/utils/FetchApi";
import { useEffect, useState } from "react";

const TenderAllotment = () => {
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
      <div className="container m-4 p-4 bg-white shadow-md rounded-md w-auto mb-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1">
            {selectedTender && (
              <span className="text-lg font-semibold">
                {selectedTender}
              </span>
            )}
          </div>
          {/* Use TenderSelect component */}
          <TenderSelect selectedTender={selectedTender} onChange={handleTenderChange} />
        </div>

        {loadingBids && <p>Loading auction bids...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-700 font-semibold">
                <th className="px-4 py-2 border-b text-center">Sno</th>
                <th className="px-4 py-2 border-b">Company Name</th>
                <th className="px-4 py-2 border-b">Person Name</th>
                <th className="px-4 py-2 border-b">Contact No</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b text-center">Qty</th>
                <th className="px-4 py-2 border-b text-center">Bid</th>
                <th className="px-4 py-2 border-b text-center">Fob Amt</th>
                <th className="px-4 py-2 border-b text-center">Freight Amt</th>
                <th className="px-4 py-2 border-b text-center">Last Updated At</th>
              </tr>
            </thead>
            <tbody>
              {!loadingBids && bids.length === 0 && (
                <tr>
                  <td colSpan="11" className="text-center py-4 text-gray-500">
                    No data record found.  <span className="text-blue-400">Select Tender</span>
                  </td>
                </tr>
              )}
              {bids.length > 0 &&
                bids.map((bid, index) => {
                  const [bidDate, bidTime] = bid.created_at.split("T");
                  return (
                    <tr key={bid.bid_id} className="hover:bg-gray-100 transition-all duration-200">
                      <td className="border px-4 py-2 text-center">{index + 1}</td>
                      <td className="border px-4 py-2">{bid.company_name}</td>
                      <td className="border px-4 py-2">{`${bid.first_name} ${bid.last_name}`}</td>
                      <td className="border px-4 py-2">{bid.phone_number}</td>
                      <td className="border px-4 py-2">{bid.email}</td>
                      <td className="border px-4 py-2 text-center">
                        {bid.qty_secured || "--"}
                      </td>
                      <td className="border px-4 py-2 text-center">${bid.bid_amount}</td>
                      <td className="border px-4 py-2 text-center">${bid.fob_amount}</td>
                      <td className="border px-4 py-2 text-center">${bid.freight_amount}</td>
                      <td className="border px-4 py-2 text-center">
                        {bidDate} - {bidTime.split(".")[0]}
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

TenderAllotment.layout = UserDashboard;
export default TenderAllotment;
