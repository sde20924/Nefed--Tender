import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { callApiGet, callApiPost, uploadDocApi } from "@/utils/FetchApi"; // Import API call functions
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TenderDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Extract the tender ID from the route
  const [tender, setTender] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to keep track of uploaded files
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false); // State to track if the application is submitted
  const [isApplicationSaved, setIsApplicationSaved] = useState(false); // Track if the application is saved

  useEffect(() => {
    if (id) {
      const fetchTenderDetails = async () => {
        try {
          // Fetch tender details by ID
          const tenderData = await callApiGet(`/tender/${id}`);
          setTender(tenderData.data);
          calculateTimeLeft(tenderData.data.app_end_time);

          // Fetch applications from server to check if any application is submitted
          const applicationsData = await callApiGet("/tender-applications");

          // Filter applications to find any with the status "submitted"
          const acceptedApplications = applicationsData.data.filter(
            (app) => 
                (app.status === "submitted" || app.status === "accepted") && 
                app.tender_id === id
        );
        

          if (acceptedApplications.length > 0) {
            setIsApplicationSubmitted(true); // If any submitted application exists, set the flag to true
          } else {
            // Fetch previously uploaded files for "draft" status
            const uploadedFilesData = await callApiGet(`/tender/${id}/files-status`);
            if (uploadedFilesData.success) {
              setUploadedFiles(uploadedFilesData.data); // Set the uploaded files from the server
            }
          }
        } catch (error) {
          console.error("Error fetching tender details or applications:", error.message);
        }
      };

      fetchTenderDetails();
    }
  }, [id]);

  // Function to calculate countdown time
  const calculateTimeLeft = (endTime) => {
    const endTimeMs = endTime * 1000;
    const interval = setInterval(() => {
      const timeLeft = endTimeMs - new Date().getTime();
      if (timeLeft > 0) {
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
      } else {
        clearInterval(interval);
        setTimeLeft("00:00:00");
        setIsCountdownComplete(true); // Mark countdown as complete
        toast.error("Time is up! You can no longer upload files."); // Show toast notification
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  };

  // Function to handle file selection and upload
  const handleFileChange = async (event, docKey, tender_doc_id) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // Append the file to the form data

      try {
        const response = await uploadDocApi("upload-doc", formData); // Correct endpoint for file upload
        if (response && response.uploaded_data) {
          const fileUrl = response.uploaded_data.doc_url; // Get the doc_url from the response
          const tenderDocId = tender_doc_id; // Get the tender_doc_id

          const newUploadedFiles = [...uploadedFiles, { tender_doc_id: tenderDocId, doc_url: fileUrl }];
          setUploadedFiles(newUploadedFiles); // Update state with new uploaded files

          toast.success("File uploaded successfully");
        } else {
          toast.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error uploading file:", error.message);
        toast.error("Error uploading file");
      }
    }
  };

  // Handle Save Application Button Click
  const handleSaveApplication = async () => {
    if (isCountdownComplete) {
      toast.error("You cannot save the application after the deadline.");
      return;
    }

    // Check if all required files are uploaded
    if (uploadedFiles.length < (tender.tenderDocuments ? tender.tenderDocuments.length : 0)) {
      toast.error("Please upload all required documents before saving.");
      return;
    }
    
    try {
      const apiResponse = await callApiPost("submit-file-url", {
        file_url: uploadedFiles,
        tender_id: id,
        status: "draft",
        tender_application_id: uploadedFiles[0]?.tender_application_id || null,
        tender_user_doc_id: uploadedFiles[0]?.tender_user_doc_id || null
      }); // Send all uploaded file URLs to your backend

      if (apiResponse.success) {
        toast.success("Your application has been saved successfully.");
        setIsApplicationSaved(true); // Set the application as saved
      } else {
        toast.error("Failed to save the application.");
      }
    } catch (error) {
      console.error("Error saving application:", error.message);
      toast.error("Error saving application.");
    }
  };

  // Handle Submit Application Button Click
  const handleSubmitApplication = async () => {
    if (isCountdownComplete) {
      toast.error("You cannot submit the application after the deadline.");
      return;
    }

    try {
      const apiResponse = await callApiPost("submit-file-url", {
        file_url: uploadedFiles,
        tender_id: id,
        status: "submitted",
        tender_application_id: uploadedFiles[0]?.tender_application_id || null,
        tender_user_doc_id: uploadedFiles[0]?.tender_user_doc_id || null
      }); // Send all uploaded file URLs to your backend with status submitted

      if (apiResponse.success) {
        toast.success("Your application has been submitted successfully.");
        setIsApplicationSubmitted(true); // Mark the application as submitted
      } else {
        toast.error("Failed to submit the application.");
      }
    } catch (error) {
      console.log(error);
      console.error("Error submitting application:", error.message);
      toast.error("Error submitting application.");
    }
  };

  if (!tender) {
    return <p>Loading...</p>; // Show loading state while fetching data
  }

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"View tender details and apply"}
        title={"Tender Details"}
      />

      <div className="bg-white w-full mx-8">
        <h1 className="p-4 text-lg">
          <b>{tender.tender_title}</b>
        </h1>
      </div>

      <div className="flex container mx-auto p-4">
        <div className="w-2/4 bg-white shadow-md rounded p-6 max-w-xl mx-auto divide-y">
          {/* Application Schedule Section */}
          <h5 className="text-lg font-bold mb-2 text-center">Application Schedule</h5>
          <div className="mb-2">
            <div className="flex justify-between mb-2 divide-y">
              <span>Start Date/Time:</span>
              <span>{new Date(tender.app_start_time * 1000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>End Date/Time:</span>
              <span>{new Date(tender.app_end_time * 1000).toLocaleString()}</span>
            </div>
          </div>

          {/* Auction Schedule Section */}
          <h5 className="text-lg font-bold mb-2 text-center">Auction Schedule</h5>
          <div className="mb-2 divide-y">
            <div className="flex justify-between mb-2">
              <span>Start Date/Time:</span>
              <span>{new Date(tender.auct_start_time * 1000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>End Date/Time:</span>
              <span>{new Date(tender.auct_end_time * 1000).toLocaleString()}</span>
            </div>
          </div>

          {/* Tender Details Section */}
          <h5 className="text-lg font-bold mb-2 text-center">Tender Details</h5>
          <div className="mb-2 divide-y">
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
        <div className="w-2/4 container mx-auto p-4">
          {/* Application Closing Countdown */}
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6 flex justify-between items-center">
            <span className="flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              Application Closing At
            </span>
            <span className="font-bold text-xl">{timeLeft}</span>
          </div>

          {/* Conditionally show file upload section or success UI */}
          {isApplicationSubmitted ? (
            <div className="text-center">
              <img src="/img/check-mark.webp" alt="Success" className="mx-auto mb-4 h-56 w-56" />
              <h3 className="text-lg font-bold">Application Submitted!</h3>
              <p>Your Application has been submitted!</p>
              <p className="text-sm text-gray-600 mt-2">For further information, visit <strong>My Tenders</strong>.</p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h5 className="text-lg font-bold mb-2">Submit Application</h5>

              {/* Attached Files Section */}
              <div className="mb-2">
                <h6 className="text-md font-semibold mb-2">Attached Files</h6>
                <p className="text-sm text-gray-600 mb-2">
                  Please upload the following documents and details. All documents
                  to be uploaded.
                </p>

                {/* Map through tender documents */}
                {tender.tenderDocuments && tender.tenderDocuments.length > 0 ? (
                  tender.tenderDocuments.map((doc, index) => (
                    <div key={index} className="border rounded-md p-4 mb-2 bg-blue-50">
                      <div className="flex items-center mb-2">
                        <i className="fas fa-file-alt text-blue-400 mr-2"></i>
                        <span className="font-medium">{doc.doc_label}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {doc.doc_ext} - {doc.doc_size} MB Allowed
                      </p>
                      <div className="flex items-center">
                        <input
                          type="file"
                          className="mr-4"
                          onChange={(e) => handleFileChange(e, doc.doc_key, doc.tender_doc_id)}
                          required
                          disabled={isCountdownComplete}
                        />
                        <span>
                          {uploadedFiles.find((file) => file.tender_doc_id === doc.tender_doc_id) ? (
                            <a
                              href={
                                uploadedFiles.find((file) => file.tender_doc_id === doc.tender_doc_id)
                                  .doc_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Uploaded File
                            </a>
                          ) : (
                            "No file chosen"
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 mb-2">No documents required for this tender.</p>
                )}
              </div>

              {/* Save Application Button */}
              <button
                onClick={handleSaveApplication}
                className={`bg-${!uploadedFiles[0]?.doc_url ? 'gray' : 'blue'}-500 text-white font-bold py-2 px-4 rounded-lg mt-4 mr-4`}
                disabled={!uploadedFiles[0]?.doc_url}
              >
                Save Application
              </button>

              {/* Show Submit Application Button only if the application is saved */}
              {/* {isApplicationSaved && ( */}
                <button
                  onClick={handleSubmitApplication}
                  className={`bg-${!uploadedFiles[0]?.doc_url ? 'gray' : 'green'}-500 text-white font-bold py-2 px-4 rounded-lg mt-4`}
                  disabled={!uploadedFiles[0]?.doc_url}
                >
                  Submit Application
                </button>
              {/* )} */}
            </div>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

TenderDetail.layout = UserDashboard;  
export default TenderDetail;
