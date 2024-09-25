import { useEffect } from "react";
import PropTypes from "prop-types";

const Snackbar = ({ open, onClose, children, type }) => {
  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => {
        onClose();
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [open, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      {open && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 text-white rounded-md ${getBackgroundColor()} shadow-lg min-w-120`}
        >
          <p>{children}</p>
        </div>
      )}
    </>
  );
};

Snackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning"]),
};

export default Snackbar;

/*
Implementation of snackbar
 const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOpenSnackbar = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  <button
        onClick={handleOpenSnackbar}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Snackbar
      </button>
   <Snackbar open={snackbarOpen} onClose={handleCloseSnackbar} type="success">
        I love snacks
      </Snackbar>
*/
