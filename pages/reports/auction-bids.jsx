import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import { callApiGet } from "@/utils/FetchApi";
import { useEffect, useState } from "react";

const AuctionBids = () => {
  const [tenders, setTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState("");
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellerTenders = async () => {
      try {
        const data = await callApiGet("/seller-tenders");
        if (data && data.data) {
          setTenders(data.data);
        } else {
          throw new Error("Failed to load tenders.");
        }
      } catch (error) {
        console.error("Error fetching tenders:", error.message);
        setError("Failed to fetch tenders.");
      }
    };

    fetchSellerTenders();
  }, []);

  const fetchAuctionBids = async (selectedTender) => {
    setLoadingBids(true);
    try {
      const response = await callApiGet(
        `/tender-Auction-bids/${selectedTender}`
      );

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
    setSelectedTender(event.target.value);
    await fetchAuctionBids(event.target.value);
  };

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"View tenders, update them, delete them"}
        title={"All Tenders"}
      />
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          {selectedTender && (
            <span className="text-lg font-semibold">
              {tenders
                .find((tender) => tender.tender_id === selectedTender)
                ?.tender_title.trim() || ""}
            </span>
          )}
        </div>
        <div className="ml-4">
          <select
            id="tenderDropdown"
            value={selectedTender}
            onChange={handleTenderChange}
            className="block w-80 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select Tender</option>
            {Array.isArray(tenders) && tenders.length > 0 ? (
              tenders.map((tender) => (
                <option key={tender.tender_id} value={tender.tender_id}>
                  {tender.tender_title.trim()}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No tenders available
              </option>
            )}
          </select>
        </div>
      </div>
      {loadingBids && <p>Loading auction bids...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loadingBids && !error && bids.length === 0 && selectedTender && (
        <p className="text-center text-gray-500">
          No data found for the selected tender.
        </p>
      )}
      {bids.length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">
            Auction Bids for Tender ID: {selectedTender}
          </h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Sno</th>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">User</th>
                <th className="px-4 py-2 border-b">Company Name</th>
                <th className="px-4 py-2 border-b">Amount</th>
                <th className="px-4 py-2 border-b">FOB</th>
                <th className="px-4 py-2 border-b">Freight</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Round</th>
                <th className="px-4 py-2 border-b">Qty</th>
                <th className="px-4 py-2 border-b">Bided At</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, index) => {
                const [bidDate, bidTime] = bid.created_at.split("T");
                return (
                  <tr key={bid.bid_id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">#{bid.user_id}</td>
                    <td className="border px-4 py-2">{bid.first_name + " " + bid.last_name}</td>
                    <td className="border px-4 py-2">{bid.company_name}</td>
                    <td className="border px-4 py-2">${bid.bid_amount}</td>
                    <td className="border px-4 py-2">${bid.fob_amount}</td>
                    <td className="border px-4 py-2">${bid.freight_amount}</td>
                    <td className="border px-4 py-2 text-center">
                      <span
                        className={`px-4 py-1 inline-block text-sm leading-5 font-semibold rounded-full ${
                          bid.status === "sold"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                        style={{
                          minWidth: "80px",
                          textAlign: "center",
                        }}
                      >
                        {bid.status
                          ? bid.status.charAt(0).toUpperCase() +
                            bid.status.slice(1)
                          : ""}
                      </span>
                    </td>

                    <td className="border px-4 py-2">{bid.round || "--"}</td>
                    <td className="border px-4 py-2">
                      {bid.qty_secured || "--"}
                    </td>
                    <td className="border px-4 py-2">
                      {bidDate} - {bidTime.split(".")[0]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

AuctionBids.layout = UserDashboard;
export default AuctionBids;
