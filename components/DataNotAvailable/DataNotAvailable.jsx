import UserDashboard from "@/layouts/UserDashboard";

const DataNotAvailable = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <h2 className="text-3xl font-bold text-gray-700 mb-4">
        Data Not Available
      </h2>
      <p className="text-lg text-gray-500">
        Sorry, we couldn't retrieve the information you're looking for.
      </p>
    </div>
  );
};
DataNotAvailable.layout = UserDashboard;
export default DataNotAvailable;
