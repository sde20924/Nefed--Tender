import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React, { useState, useEffect } from "react";
import { callApiGet , callApiPost ,callApiDelete } from "@/utils/FetchApi";
import moment from "moment";
import { useRouter } from 'next/router';

const Tenders = () => {
  const router = useRouter();
  const [tenders, setTenders] = useState([]);
  const [selectedTenderId, setSelectedTenderId] = useState(null); // Track which tender's menu is open

  useEffect(() => {
    const fetchSellerTenders = async () => {
      try {
        const data = await callApiGet("/seller-tenders"); // API endpoint to fetch tenders for a specific seller
        setTenders(data.data);
      } catch (error) {
        console.error("Error fetching tenders:", error.message);
      }
    };

    fetchSellerTenders();
  }, []);

  // Function to format time using moment
  const formatDate = (epochTime) => moment(epochTime).format("DD-MM-YYYY HH:mm");

  // Function to handle Action button click
  const handleActionClick = (tenderId) => {
    // Toggle the menu for the clicked tender
    setSelectedTenderId((prevSelectedId) => (prevSelectedId === tenderId ? null : tenderId));
  };

  const handleMenuOptionClick = async (option, tender) => {
    if (option === "edit") {
      router.push(`/tenders/editTenderForm?id=${tender.tender_id}`);
    } else if (option === "delete") {
      const confirmDelete = window.confirm("Are you sure you want to delete this tender?");
      if (confirmDelete) {
        try {
          const response = await callApiDelete(`delete-tender/${tender.tender_id}`);
          if (response.success) {
            alert('Tender deleted successfully');
            // Refetch tenders to update the list after deletion
            // setTenders(tenders.filter(t => t.tender_id !== tender.tender_id));
          }
        } catch (error) {
          console.error('Error deleting tender:', error);
          alert('Failed to delete tender');
        }
      }
    } else if (option === "clone") {
      try {
        const response = await callApiPost(`clone-tender/${tender.tender_id}`, {}); // Cloning still requires formData (even if empty)
        if (response.success) {
          alert('Tender cloned successfully');
          // Optionally, refetch tenders to include the new cloned tender
          fetchSellerTenders();
        }
      } catch (error) {
        console.error('Error cloning tender:', error);
        alert('Failed to clone tender');
      }
    }
    setSelectedTenderId(null); // Close the menu after the option is selected
  };
  
  

  

  return (
    <div>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"View tenders, update it, delete it"}
        title={"All Tenders"}
      />
      <div className="container mx-auto p-4">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sno</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tenders.map((tender, index) => (
              <tr key={tender.tender_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                  <button
                    onClick={() => handleActionClick(tender.tender_id)}
                    className="bg-gray-200 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    Action
                  </button>
                  {selectedTenderId === tender.tender_id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleMenuOptionClick("edit", tender)}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleMenuOptionClick("clone", tender)}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        clone
                      </button>
                      <button
                        onClick={() => handleMenuOptionClick("delete", tender)}
                        className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100" 
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">{tender.tender_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tender.tender_title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">Published</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(tender.created_at)} <br />
                  {moment(tender.created_at).fromNow()} {/* Displays relative time */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Tenders.layout = UserDashboard;
export default Tenders;
