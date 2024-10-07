import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import TenderSelect from "@/components/TenderSelectList/TenderSelect"; // Import TenderSelect component
import { callApiGet } from "@/utils/FetchApi";
import { useState } from "react";

const MiniSummary = () => {
  const [selectedTender, setSelectedTender] = useState("");
  const [tenderData, setTenderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTenderSummary = async (selectedTender) => {
    setLoading(true);
    try {
      const response = await callApiGet(
        `/tender-mini-summary/${selectedTender}`
      );

      if (response && response.success) {
        setTenderData(response.data);
        setError("");
      } else {
        throw new Error("Failed to load tender summary");
      }
    } catch (error) {
      console.error("Error fetching tender summary:", error.message);
      setError("Failed to fetch tender summary. Please try again later.");
      setTenderData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTenderChange = async (event) => {
    const tenderId = event.target.value;
    setSelectedTender(tenderId);
    if (tenderId) {
      await fetchTenderSummary(tenderId);
    }
  };

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"View summary of selected tenders"}
        title={"Tender Mini Summary"}
      />
      <div className="container mx-auto my-4 p-6 bg-white shadow-md rounded-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold">
              Selected Tender ID: {selectedTender || "N/A"}
            </span>
          </div>
          <div className="ml-auto">
            {/* Use TenderSelect component */}
            <TenderSelect
              selectedTender={selectedTender}
              onChange={handleTenderChange}
            />
          </div>
        </div>

        {loading && <p>Loading tender summary...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {tenderData && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left text-sm uppercase text-gray-700 font-semibold border-b">
                  <th className="px-6 py-4 text-center">Sno</th>
                  <th className="px-6 py-4 text-left">Tender</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Destination Port</th>
                  <th className="px-6 py-4 text-right">Ttl Qty (In MT)</th>
                  <th className="px-6 py-4 text-right">Bid</th>
                  <th className="px-6 py-4 text-right">Fob Amt</th>
                  <th className="px-6 py-4 text-right">Freight Amt</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                <tr className="hover:bg-gray-100 transition-all duration-200">
                  <td className="border-t px-6 py-3 text-center">1</td>
                  <td className="border-t px-6 py-3">
                    {`${tenderData.tender_title}/${tenderData.qty}MT/${tenderData.dest_port}`}
                  </td>
                  <td className="border-t px-6 py-3">
                    {new Date(
                      tenderData.app_start_time * 1000
                    ).toLocaleString()}
                  </td>
                  <td className="border-t px-6 py-3">{tenderData.dest_port}</td>
                  <td className="border-t px-6 py-3 text-right">
                    {tenderData.qty}
                  </td>
                  <td className="border-t px-6 py-3 text-right">
                    $
                    {tenderData.bid_amount
                      ? Number(tenderData.bid_amount).toFixed(2)
                      : "--"}
                  </td>
                  <td className="border-t px-6 py-3 text-right">
                    $
                    {tenderData.fob_amount
                      ? Number(tenderData.fob_amount).toFixed(2)
                      : "--"}
                  </td>
                  <td className="border-t px-6 py-3 text-right">
                    $
                    {tenderData.freight_amount
                      ? Number(tenderData.freight_amount).toFixed(2)
                      : "--"}
                  </td>
                </tr>
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan="6" className="border-t px-6 py-3 text-right">
                    Total Quantity
                  </td>
                  <td colSpan="2" className="border-t px-6 py-3 text-right">
                    {tenderData.qty}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {!loading && !tenderData && !error && (
          <p className="text-gray-500">Select a tender to view its summary.</p>
        )}
      </div>
    </>
  );
};

MiniSummary.layout = UserDashboard;
export default MiniSummary;
