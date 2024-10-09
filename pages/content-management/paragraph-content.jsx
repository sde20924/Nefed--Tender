import React, { useEffect, useState } from 'react';
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import UserDashboard from "@/layouts/UserDashboard";
import { callApiGet, callApiPost } from '../../utils/FetchApi'; // Assuming both methods are exported

const EditHomepage = () => {
  // State variables to hold the title, subheading, and description
  const [title, setTitle] = useState('');
  const [subheading, setSubheading] = useState('');
  const [description, setDescription] = useState('');

  // Fetch data from the server when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callApiGet('/get-home-page-content'); // Call the API
        if (response.success && response.data) {
          // Set the state variables with the data from the server
          setTitle(response.data.title);
          setSubheading(response.data.subheading);
          setDescription(response.data.description);
        } else {
          console.error('Failed to load homepage data');
        }
      } catch (error) {
        console.error('Error fetching homepage content:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on component mount

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { title, subheading, description };

    try {
      // Call the API to update the homepage content
      const data = await callApiPost('update-home-page-content', formData); // Update API call
      console.log("Homepage content updated:", data);
      alert('Homepage content updated successfully');
    } catch (error) {
      console.error('Error updating homepage content:', error.message);
      alert('Failed to update content');
    }
  };

  return (
    <>
      <HeaderTitle
        padding={"p-4"}
        subTitle={"Edit Home Page Content"}
        title={"Edit Page"}
      />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Homepage Content</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title} // Use the state value
              onChange={(e) => setTitle(e.target.value)} // Update the state on input change
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subheading">
              Subheading
            </label>
            <input
              id="subheading"
              type="text"
              value={subheading} // Use the state value
              onChange={(e) => setSubheading(e.target.value)} // Update the state on input change
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter subheading"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description} // Use the state value
              onChange={(e) => setDescription(e.target.value)} // Update the state on input change
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter description"
              rows="5"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Content
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

EditHomepage.layout = UserDashboard;
export default EditHomepage;
