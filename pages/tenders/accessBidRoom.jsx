import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { callApiGet, callApiPost } from "@/utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const AccessBidRoom = () => {
  const router = useRouter();
  const { tenderId } = router.query; // Get the tenderId from the query parameters
  const [tender, setTender] = useState(null);
  const [timeLeft, setTimeLeft] = useState(""); // Countdown timer
  const [isAuctionLive, setIsAuctionLive] = useState(false); // State to track if the auction is live
  const [auctionEnded, setAuctionEnded] = useState(false); // New state to track if auction has ended
  const [bids, setBids] = useState([]); // State to store all bids
  const [lBidUserId, setLBidsUserId] = useState();
  const [lBid, setLBid] = useState();

  const [auctionItems, setAuctionItems] = useState([]); // State to store auction items
  const [itemBids, setItemBids] = useState({}); // Store user input for each item
  const [totalBidAmount, setTotalBidAmount] = useState(0); // Store the total bid amount

  useEffect(() => {
    if (tenderId) {
      fetchTenderDetails();
      fetchBids();
      fetchAuctionItems(); // Fetch auction items when tenderId is available
    }
  }, [tenderId]);

  // Fetch auction items
  const fetchAuctionItems = async () => {
    try {
      const response = await callApiGet(
        `/get-tender-auction-items/${tenderId}`
      );

      // Check if auction_items array exists and is not empty
      if (
        response &&
        response.auction_items &&
        response.auction_items.length > 0
      ) {
        setAuctionItems(response.auction_items); // Set auction items data
      } else {
        toast.error("No auction items found.");
      }
    } catch (error) {
      console.error("Error fetching auction items:", error.message);
      toast.error("Error fetching auction items.");
    }
  };

  // Fetch tender details
  const fetchTenderDetails = async () => {
    try {
      const tenderData = await callApiGet(`/tender/${tenderId}`); // Fetch tender details by ID
      setTender(tenderData.data);
      checkAuctionStatus(
        tenderData.data.auct_start_time,
        tenderData.data.auct_end_time
      );
    } catch (error) {
      console.error("Error fetching tender details:", error.message);
    }
  };

  // Fetch bids for the specific tender
  const fetchBids = async () => {
    try {
      const response = await callApiGet(`/tender/bid/${tenderId}`); // Fetch bids by tender ID
      if (response.success) {
        setBids(response.allBids); // Set all bids data
        setLBidsUserId(response.lowestBid.user_id);
        setLBid(response.lowestBid.bid_amount);
      }
    } catch (error) {
      console.error("Error fetching bids:", error.message);
    }
  };

  useEffect(() => {
    if (auctionEnded && lBidUserId) {
      announceWinner();
    }
  }, [auctionEnded, lBidUserId]);

  // Function to check auction status and calculate countdown
  const checkAuctionStatus = (startTime, endTime) => {
    const now = new Date().getTime();
    const startTimeMs = startTime * 1000;
    const endTimeMs = endTime * 1000;

    if (now >= startTimeMs && now <= endTimeMs) {
      setIsAuctionLive(true);
      calculateTimeLeft(endTimeMs); // Countdown to auction end time
    } else if (now < startTimeMs) {
      setIsAuctionLive(false);
      calculateTimeLeft(startTimeMs); // Countdown to auction start time
    } else {
      setIsAuctionLive(false);
      setAuctionEnded(true); // Auction has ended
      setTimeLeft("Auction is closed");
    }
  };

  // Function to calculate countdown time
  const calculateTimeLeft = (targetTimeMs) => {
    const interval = setInterval(() => {
      const timeLeft = targetTimeMs - new Date().getTime();
      if (timeLeft > 0) {
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        clearInterval(interval);
        setTimeLeft("Auction is closed");
        setIsAuctionLive(false);
        setAuctionEnded(true);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  };

  // Handle input change for each auction item
  const handleInputChange = (index, value) => {
    const newBids = { ...itemBids, [index]: value }; // Update the user input for each item
    setItemBids(newBids);

    // Calculate the total bid amount (quantity * user input)
    let sum = 0;
    Object.keys(newBids).forEach((key) => {
      const bidValue = parseFloat(newBids[key]) || 0;
      const itemQuantity = parseFloat(auctionItems[key]?.auct_qty) || 0;
      sum += bidValue * itemQuantity; // Multiply user input by item quantity
    });
    setTotalBidAmount(sum); // Update the total bid amount
  };

  // Render auction items with input fields
  const renderAuctionItems = () => {
    return auctionItems.map((item, index) => (
      <div
        key={index}
        className="grid grid-cols-3 gap-4 items-center mb-4 p-4 border rounded-lg bg-gray-100"
      >
        {/* First column: Item name */}
        <div className="text-gray-700 font-semibold">
          {item.auct_item.trim()}
        </div>

        {/* Second column: Quantity of item */}
        <div className="text-gray-700">{item.auct_qty}</div>

        {/* Third column: Input field for entering a number */}
        <div>
          <input
            type="number"
            placeholder="Enter your bid"
            className="p-2 border border-gray-300 rounded w-full"
            value={itemBids[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        </div>
      </div>
    ));
  };

  // Handle bid submission
  const handlePlaceBid = () => {
    // Ensure bid amount is provided
    if (totalBidAmount <= 0) {
      toast.error("Please enter valid bid amounts.");
      return;
    }

    // Submit the bid
    submitBid(); // Call the function to submit the bid
  };

  // Function to submit the bid to the server
  const submitBid = async () => {
    try {
      const response = await callApiPost("bid/submit", {
        tender_id: tenderId, // Pass the tender ID
        bid_amount: totalBidAmount, // Pass the total bid amount
      });

      if (response.success) {
        toast.success(`Bid of ₹${totalBidAmount} placed successfully.`);
        fetchBids(); // Refresh the bid list after placing a bid
      } else {
        toast.error("Failed to place bid. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting bid:", error.message);
      toast.error("Error submitting bid. Please try again.");
    }
  };

  //winner announce than update the table
  const announceWinner = async () => {
    try {
      // Ensure lBidUserId and tender are defined
      if (!lBidUserId || !tender) {
        console.error("No lowest bid user ID or tender data available.");
        return;
      }

      // Create the formData object with necessary details
      const formData = {
        winner_user_id: lBidUserId,
        qty_secured: tender.qty_split_criteria,
        round: 1,
        status: "sold",
      };

      // Call the API using callApiPost function
      const response = await callApiPost(
        `tender/announce-winner/${tenderId}`,
        formData
      );
 
      if (response.success) {
        toast.success("Winner announced successfully!");
        fetchBids(); // Refresh the bid list to see updated status
      } else {
        toast.error("Failed to announce winner. Please try again.");
      }
    } catch (error) {
      console.error("Error announcing winner:", error.message);
      toast.error("Error announcing winner. Please try again.");
    }
  };

  // Render the position box showing the lowest bid or L1 status
  const renderPositionBox = () => {
    // Retrieve local user data from localStorage
    const localData = JSON.parse(localStorage.getItem("data"));
    const { data } = localData || {}; // Ensure localData exists
    const loggedInUserId = data?.user_id; // Get logged-in user's ID

    // Ensure there are bids before proceeding
    if (bids.length === 0) {
      return <p>No bids placed yet.</p>;
    }

    // Find the lowest bid from all bids
    const lowestBid = bids.reduce((lowest, bid) =>
      lowest && lowest.bid_amount < bid.bid_amount ? lowest : bid
    );

    // Check if the logged-in user has the lowest bid (L1)
    const isL1 = lBidUserId === loggedInUserId;

    // If the auction has ended and the user is L1
    if (auctionEnded && isL1) {
      return (
        <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg mb-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <i className="fas fa-check-circle text-green-700 text-3xl"></i>
          </div>
          <p className="font-semibold text-lg">
            Congratulations! You have successfully secured a quantity of{" "}
            {tender.qty_split_criteria} MT at the rate of ₹
            {Number(lBid).toFixed(2)} CIF to {tender.dest_port}.
          </p>
        </div>
      );
    }

    // If the auction is live
    return (
      <div className="border rounded-lg p-4 mb-4">
        <h4 className="text-lg font-semibold mb-2 text-center">Position Box</h4>
        {isAuctionLive ? (
          <p
            className={`p-2 rounded-lg ${isL1 ? "bg-green-100 text-green-800 text-center" : "bg-white text-gray-800"}`}
          >
            {isL1
              ? `You are L1, your Bid value is: ₹${Number(lBid).toFixed(2)} per unit.`
              : `Lowest Bid Value: ₹${Number(lBid).toFixed(2)} per unit.`}
          </p>
        ) : (
          <p>The auction has not started yet.</p>
        )}
      </div>
    );
  };

  if (!tender) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"Bid Room, set visibility etc."}
        title={"Bid Room"}
      />

      <div className="flex container mx-auto p-4">
        <div className="w-3/4 mx-8 bg-white">
          <div className="text-lg p-4">
            <h1>
              <b>({tender.tender_id}) - Round 1</b>
            </h1>
          </div>

          <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded-lg mb-4 flex flex-col justify-between items-center">
            <div className="text-lg mb-4">
              <h1>
                {isAuctionLive
                  ? "Auction is live!"
                  : auctionEnded
                  ? "Auction is closed!"
                  : "Auction is not started yet!"}
              </h1>
            </div>
            <div>
              <span className="flex items-center text-gray-500">
                <i className="fas fa-clock mr-2"></i>
                {isAuctionLive
                  ? "Ending At :"
                  : auctionEnded
                  ? "Auction Ended"
                  : "Starting At:"}
              </span>
            </div>
            <div>
              <span className="font-bold text-lg">{timeLeft}</span>
            </div>
          </div>

          {renderPositionBox()}

          {isAuctionLive && (
            <div className="mt-4 p-4 border rounded bg-gray-100">
              <h5 className="text-lg font-bold mb-2">Auction Items</h5>
              {renderAuctionItems()} {/* Render the auction items */}

              {/* Display the total bid amount */}
              <div className="flex items-center mt-4">
                <span className="text-gray-500 mr-2">₹</span>
                <label
                  className="whitespace-nowrap text-sm font-medium text-gray-700"
                  style={{ width: "150px" }}
                >
                  Total Bid Amount
                </label>
                <input
                  type="text"
                  value={totalBidAmount.toFixed(2)} // Total bid amount from state
                  readOnly
                  className="flex-1 p-2 border border-gray-300 bg-gray-100 rounded"
                  placeholder="Bid Amount"
                />
              </div>

              {/* Place Bid Button */}
              <button
                onClick={handlePlaceBid} // Using the existing place bid handler
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                Place Bid
              </button>
            </div>
          )}
        </div>

        <div className="w-2/4 bg-white shadow-md rounded p-6 max-w-xl mx-auto divide-y">
          <div className="bg-white">
            <h1 className="p-4 text-lg">
              <b>{tender.tender_title}</b>
            </h1>
          </div>

          <h5 className="text-lg font-bold mb-2 text-center">
            Application Schedule
          </h5>
          <div className="mb-2">
            <div className="flex justify-between mb-2 divide-y">
              <span>Start Date/Time:</span>
              <span>
                {new Date(tender.app_start_time * 1000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>End Date/Time:</span>
              <span>
                {new Date(tender.app_end_time * 1000).toLocaleString()}
              </span>
            </div>
          </div>

          <h5 className="text-lg font-bold mb-2 text-center">
            Auction Schedule
          </h5>
          <div className="mb-2 divide-y">
            <div className="flex justify-between mb-2">
              <span>Start Date/Time:</span>
              <span>
                {new Date(tender.auct_start_time * 1000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>End Date/Time:</span>
              <span>
                {new Date(tender.auct_end_time * 1000).toLocaleString()}
              </span>
            </div>
          </div>

          <h5 className="text-lg font-bold mb-2 text-center">Tender Details</h5>
          <div className="mb-2 divide-y">
            <div className="flex justify-between mb-2">
              <span>Minimum bid : </span>
              <span>{tender.start_price}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Quantity:</span>
              <span>{tender.qty}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Currency:</span>
              <span>{tender.currency}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Destination Port:</span>
              <span>{tender.dest_port}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Bag Size:</span>
              <span>{tender.bag_size}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Bag Type:</span>
              <span>{tender.bag_type}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Timeframe For Extension:</span>
              <span>{tender.time_frame_ext}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Amount of Time Extension:</span>
              <span>{tender.amt_of_ext}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Auto Auction Extension before end time:</span>
              <span>{tender.aut_auct_ext_bfr_end_time}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Minimum Decrement Bid value:</span>
              <span>₹{tender.min_decr_bid_val.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

AccessBidRoom.layout = UserDashboard;
export default AccessBidRoom;
