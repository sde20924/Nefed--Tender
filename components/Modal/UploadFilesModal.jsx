import { useEffect, useState } from "react";
import Snackbar from "../Snackbar/Snackbar";
import { uploadDocApi } from "@/utils/FetchApi";
import { useDispatch } from "react-redux";
import { updateUserStatus } from "@/store/slices/profileSlice";

const UploadFilesModal = ({ isOpen, onClose, isVerified, docs }) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const dispatch = useDispatch();

  //SNACKBAR CODE START
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("warning");

  const handleOpenSnackbar = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackMsg = (type, msg) => {
    setSnackMsg(msg);
    setSnackType(type);
    handleOpenSnackbar();
  };
  //SNACKBAR CODE END

  const handleSubmit = async (e) => {
    setIsSubmitDisabled(true);
    e.preventDefault();
    const formData = new FormData();
    Object.keys(selectedFiles).forEach((key) => {
      formData.append(key, selectedFiles[key]);
    });

    const data = await uploadDocApi("upload-user-doc-new", formData);
    console.log(data);
    if (data.success) {
      localStorage.removeItem("openModal");
      dispatch(updateUserStatus("pending"));
      showSnackMsg("success", data.msg);
      onClose();
      setIsSubmitDisabled(false);
    } else {
      showSnackMsg("error", `${data.msg}, ${data.error}`);
      setIsSubmitDisabled(false);
    }
  };

  const handleFileChange = (e, docName) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles((prevState) => ({
        ...prevState,
        [docName]: file,
      }));
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSnackbarOpen(false);
    }
  }, [isOpen]);
  return (
    <>
      {isOpen ? (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="w-full flex justify-end">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="bg-white rounded-lg p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-2 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    {/* File inputs */}
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Complete Your Verification
                    </h3>
                    <h3
                      className="mt-2 text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Upload Documents
                    </h3>

                    {/* MAP Documents Array Here */}
                    <div className="space-y-4">
                      <form
                        onSubmit={handleSubmit}
                        className="p-6 space-y-4"
                        encType="multipart/form-data"
                      >
                        {docs.map((doc, index) => (
                          <div key={index} className="space-y-2">
                            <label className="block text-gray-700 font-semibold">
                              {doc.name}{" "}
                              <span className="text-sm text-gray-500">
                                (Max size: {doc.max_size} MB)
                              </span>
                            </label>
                            <input
                              required
                              type="file"
                              accept={
                                doc.doc_ext === "pdf"
                                  ? "application/pdf"
                                  : "image/jpeg,image/png, image/jpg"
                              }
                              onChange={(e) => handleFileChange(e, doc.name)}
                              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            />
                          </div>
                        ))}
                        <button
                          type="submit"
                          disabled={isSubmitDisabled}
                          style={{
                            cursor: isSubmitDisabled
                              ? "not-allowed"
                              : "pointer",
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                          Submit
                        </button>

                        <Snackbar
                          open={snackbarOpen}
                          onClose={handleCloseSnackbar}
                          type={snackType}
                        >
                          {snackMsg}
                        </Snackbar>

                        {/* Display selected files */}
                        {/* <div className="mt-4">
                          <h2 className="text-lg font-semibold mb-2">
                            Selected Files:
                          </h2>
                          <ul className="list-disc list-inside">
                            {Object.keys(selectedFiles).map((key, index) => (
                              <li key={index}>
                                {key}: {selectedFiles[key].name}
                              </li>
                            ))}
                          </ul>
                        </div> */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default UploadFilesModal;
