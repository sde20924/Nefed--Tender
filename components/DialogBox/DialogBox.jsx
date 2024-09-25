const ConfirmationDialog = ({ isOpen, onClose, okPress, data, randomFun=()=>{} }) => {
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
              <div className="bg-white pt-2 pb-2 pl-4 pr-4">
                <h3 className="text-xl">{data && data.title}</h3>
                <h3 className="mt-2">{data && data.desc}</h3>
                <div className="mt-2 flex justify-end gap-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-black rounded-md focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={()=>okPress(randomFun)}
                    className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ConfirmationDialog;
