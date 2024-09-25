import { useEffect, useState } from "react";
import Snackbar from "../Snackbar/Snackbar";
import { useDispatch } from "react-redux";
import { callApi } from "@/utils/FetchApi";
import { addBuyerTag } from "@/store/slices/buyersSlice";
import { addSellerTag } from "@/store/slices/sellerSlice";

const AddTagModal = ({ isOpen, onClose, user }) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  // SNACKBAR CODE START
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
  // SNACKBAR CODE END

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitDisabled(true);
    if (!name || !description) {
      showSnackMsg("warning", "All fields are required");
      setIsSubmitDisabled(false);
      return;
    }
    const data = await callApi("admin/create-tag", "POST", {
      name,
      description,
      for_table: user,
    });
    if (data.success) {
      showSnackMsg("success", data.msg);
      if (user === "buyer") {
        dispatch(addBuyerTag(data.tag));
      } else {
        dispatch(addSellerTag(data.tag));
      }
      setIsSubmitDisabled(false);
      onClose();
    } else {
      setIsSubmitDisabled(false);
      showSnackMsg("error", data.msg);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      console.log("d");
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
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Create Tag
                    </h3>
                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                      {/* Name input */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>

                      {/* Description input */}
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>

                      {/* Submit button */}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitDisabled}
                          className={`${
                            isSubmitDisabled
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          } text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* Snackbar for notifications */}
              <Snackbar
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                type={snackType}
              >
                {snackMsg}
              </Snackbar>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddTagModal;
