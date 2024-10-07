import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import { callApiGet } from "../../utils/FetchApi"; // Correct import for callApi function
import { useEffect, useState } from "react";

const userManagement = () => {
  const [sellerList, setSellerList] = useState([]); // State to store the list of sellers
  const [error, setError] = useState(null); // State to store any error

  useEffect(() => {
    // Fetch the list of sellers
    const fetchSellerList = async () => {
      try {
        // Call the API endpoint with GET method
        const response = await callApiGet("/get-buyer-list");

        // Log response for debugging
        console.log("API Response:", response);

        // Check if the response is successful
        if (response && response.success) {
          // Set the list of sellers to state
          setSellerList(response.sellerData);
          console.log("Seller Data:", response.sellerData);
        } else {
          // Handle unsuccessful response
          throw new Error("Error in fetching seller data");
        }
      } catch (err) {
        // Set any errors to state
        setError(err.message);
      }
    };

    fetchSellerList(); // Invoke the function to fetch seller list
  }, []); // Empty dependency array means this effect will run only once

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"List of all sellers"}
        title={"Seller Management"}
      />
      <div className="container mx-auto mt-4 p-4 bg-white shadow-md rounded-md">

        {/* Display an error if it exists */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display the list of sellers if available */}
        {sellerList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left text-sm uppercase text-gray-700 font-semibold border-b">
                  <th className="px-4 py-2 border-b">#</th>
                  <th className="px-4 py-2 border-b">Customer</th>
                  <th className="px-4 py-2 border-b">Role</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Phone</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {sellerList.map((seller, index) => (
                  <tr key={seller.seller_id} className="hover:bg-gray-100 transition-all duration-200 text-sm">
                    <td className="border-t px-4 py-2">UID{index + 1}</td>
                    <td className="border-t px-4 py-2">
                      {seller.first_name} {seller.last_name}
                    </td>
                    <td className="border-t px-4 py-2">User</td>
                    <td className="border-t px-4 py-2">{seller.email}</td>
                    <td className="border-t px-4 py-2">{seller.phone_number}</td>
                    <td className="border-t px-4 py-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        Active
                      </span>
                    </td>
                    <td className="border-t px-4 py-2">{new Date(seller.created_on).toISOString().split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // If there are no sellers and no error, show this message
          !error && <p className="text-gray-500">No sellers found.</p>
        )}
      </div>
    </>
  );
};

userManagement.layout = UserDashboard; 
export default userManagement;
