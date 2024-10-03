import React, { useEffect, useState } from 'react';
import { callApiGet } from "@/utils/FetchApi";

const TenderSelect = ({ selectedTender, onChange }) => {
  const [tenders, setTenders] = useState([]);
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

  return (
    <div className="ml-4">
      {error && <p className="text-red-500">{error}</p>}
      <select
        id="tenderDropdown"
        value={selectedTender}
        onChange={onChange}
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
  );
};

export default TenderSelect;
