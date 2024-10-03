import React, { useEffect, useState } from 'react';
import { callApiGet, callApiPost } from '../../utils/FetchApi'; 
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason('');
    } else {
      alert('Please enter a reason for rejection.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Reject Application</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          rows="4"
          placeholder="Enter the reason for rejection"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const SubmittedApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  useEffect(() => {
    const fetchSubmittedApplications = async () => {
      try {
        const data = await callApiGet('/submitted-tender-applications');
        setApplications(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSubmittedApplications();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleAction = async (applicationId, action, reason = '') => {
    if (action === 'rejected' && !reason) {
      // console.log(`Rejection reason required for Application ID: ${applicationId}`);
      return;
    }

    try {
      const response = await callApiPost('update-tender-application', {
        applicationId,
        action,
        reason,
      });

      // console.log('Response:', response);
      // Handle successful response, update the UI accordingly
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.tender_application_id === applicationId
            ? { ...app, status: action, rejected_reason: reason }
            : app
        )
      );
    } catch (err) {
      console.error('Error updating application:', err);
    }
  };

  const handleReject = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (reason) => {
    if (selectedApplicationId) {
      handleAction(selectedApplicationId, 'rejected', reason);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"View Submitted Applications"}
        title={"Submitted Applications"}
      />

      <div className="container mx-auto p-4"> 
        <h1 className="text-2xl font-bold mb-4">Your Submitted Tender Applications</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.length > 0 ? (
            applications.map((application) => (
              <div
                key={application.tender_application_id}
                className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200"
              >
                <h2 className="text-xl font-semibold mb-2">Tender ID: {application.tender_id}</h2>
                <h3>Tender Name : {application.tender_title}</h3>
                <h3>Buyer Name : {application.first_name + " " + application.last_name}</h3>
                <h3>Company  : {application.company_name}</h3>
                <p className="text-lg font-medium mb-2">Status: {application.status}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleAction(application.tender_application_id, 'accepted')}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(application.tender_application_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No submitted applications found.</p>
          )}
        </div>
      </div>

      {/* Modal for Rejection Reason */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};

SubmittedApplications.layout = UserDashboard;
export default SubmittedApplications;
