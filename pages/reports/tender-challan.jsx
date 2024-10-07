import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import TenderSelect from "@/components/TenderSelectList/TenderSelect"; // Import TenderSelect component
import { callApiGet } from "@/utils/FetchApi";
import { useEffect, useState } from "react";

const TenderChallan = () => {
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
        title={"Tender Challan"}
      />
      <div className="container m-4 p-4 bg-white shadow-md rounded-md w-auto mb-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1">
            {selectedTender && (
              <span className="text-lg font-semibold">
                Selected Tender ID: {selectedTender}
              </span>
            )}
          </div>
          {/* Use TenderSelect component */}
          <TenderSelect selectedTender={selectedTender} onChange={handleTenderChange} />
        </div>

        {loadingBids && <p>Loading auction bids...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {bids.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-center text-sm uppercase text-gray-700 font-semibold">
                  <th className="px-4 py-2 border-b">Sno</th>
                  <th className="px-4 py-2 border-b">Company Name</th>
                  <th className="px-4 py-2 border-b">Person Name</th>
                  <th className="px-4 py-2 border-b">Application Id</th>
                  <th className="px-4 py-2 border-b">Paid EMD Amount</th>
                  <th className="px-4 py-2 border-b">Settled Amount</th>
                  <th className="px-4 py-2 border-b">Refunded Amount</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, index) => {
                  return (
                    <tr key={bid.bid_id} className="hover:bg-gray-100 transition-all duration-200 text-center">
                      <td className="border-t px-4 py-2">{index + 1}</td>
                      <td className="border-t px-4 py-2">{bid.company_name}</td>
                      <td className="border-t px-4 py-2">{`${bid.first_name} ${bid.last_name}`}</td>
                      <td className="border-t px-4 py-2">{bid.user_id}</td>
                      <td className="border-t px-4 py-2 text-green-500">{bid.emd_amt}₹</td>
                      <td className="border-t px-4 py-2 text-green-500">
                        {bid.settled_amount || "--"}
                      </td>
                      <td className="border-t px-4 py-2 text-red-500">
                        {bid.refunded_amount || "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loadingBids && bids.length === 0 && !error && (
          <p className="text-gray-500">No bids found. Please select a tender to view details.</p>
        )}
      </div>
    </>
  );
};

TenderChallan.layout = UserDashboard;
export default TenderChallan;
