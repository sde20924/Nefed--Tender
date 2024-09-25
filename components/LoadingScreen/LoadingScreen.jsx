import UserDashboard from "@/layouts/UserDashboard";
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="animate-pulse space-y-4 w-full max-w-sm">
        <div className="h-12 bg-gray-200 rounded-full w-24 mx-auto mt-8"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};
LoadingScreen.layout = UserDashboard;
export default LoadingScreen;
