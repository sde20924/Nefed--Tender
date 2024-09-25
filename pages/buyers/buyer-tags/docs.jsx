import DataNotAvailable from "@/components/DataNotAvailable/DataNotAvailable";
import HeaderTitle from "@/components/HeaderTitle/HeaderTitle";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import AddDocsModal from "@/components/Modal/AddDocsModal";
import UserDashboard from "@/layouts/UserDashboard";
import { callApi, callApiGet } from "@/utils/FetchApi";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const DocsForTags = () => {
  const router = useRouter();
  const query = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [documents, setDocuments] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    fileType: "",
    fileSize: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagQuery = router.query;
    const tag = Object.keys(tagQuery)[0];
    if (tag) {
      setIsSubmitDisabled(true);
      const data = await callApi(
        "admin/create-required-docs-for-tags",
        "POST",
        {
          tag_id: +tag,
          name: formData.name,
          doc_ext: formData.fileType,
          max_size: formData.fileSize,
        }
      );
      if (data.success) {
        setDocuments([...documents, data.document]);
        setIsSubmitDisabled(false);
        alert(data.msg);
        closeModal();
      } else {
        setIsSubmitDisabled(false);
        alert(data.msg);
      }
    } else {
      alert("Invalid tag ID");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getDocuments = async () => {
    const tagQuery = router.query;
    const tag_id = Object.keys(tagQuery)[0];
    const data = await callApiGet(
      `admin/get-list-of-required-docs-with-tag-id/${tag_id}`
    );
    console.log(data);
    if (data.success) {
      setDocuments(data.requiredDocuments);
    } else {
      if (data.msg === "No required documents found for this tag") {
        setDocuments([]);
      }
    }
  };

  //Remove Documents
  const handleRemove = async (tag_id, doc_id) => {
    const data = await callApi(
      `admin/remove-item-of-required-docs-with-tag-id/${tag_id}/${doc_id}`,
      "DELETE"
    );
    if (data.success) {
      const updatedDocs = documents.filter((ele) => ele.id != data.document.id);
      setDocuments(updatedDocs);
      alert(data.msg);
    } else {
      alert(data.msg);
    }
  };

  useEffect(() => {
    if (Object.keys(query).length !== 0) {
      getDocuments();
    }
  }, [query]);

  if (!documents) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-4">
      <HeaderTitle
        title={`All Required Documents For ${localStorage.getItem('tag_name')} Tag`}
        subTitle={"View docs, delete docs, add docs"}
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={openModal}
          className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Docs
        </button>
        <AddDocsModal isOpen={isModalOpen} onClose={closeModal}>
          <div className="max-w-md mx-auto mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Upload File Details
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter file name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="fileType"
                  className="block text-sm font-medium text-gray-700"
                >
                  File Type
                </label>
                <select
                  required
                  id="fileType"
                  name="fileType"
                  value={formData.fileType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select File Type</option>
                  <option value="image">Image</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="fileSize"
                  className="block text-sm font-medium text-gray-700"
                >
                  File Size (MB)
                </label>
                <input
                  type="number"
                  id="fileSize"
                  name="fileSize"
                  value={formData.fileSize}
                  onChange={handleChange}
                  placeholder="Enter file size in MB"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  style={{
                    cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </AddDocsModal>
      </div>
      {documents.length === 0 ? (
        <DataNotAvailable />
      ) : (
        <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Documents
          </h2>
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-gray-700">{doc.name}</span>
                  <span className="text-gray-600">Type: {doc.doc_ext}</span>
                  <span className="text-gray-600">
                    Max Size: {doc.max_size} MB
                  </span>
                </div>
                <button
                  onClick={() => handleRemove(doc.tag_id, doc.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
DocsForTags.layout = UserDashboard;
export default DocsForTags;
