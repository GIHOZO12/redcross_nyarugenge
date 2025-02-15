import React from "react";
import Sidebar from "../Components/Sidebar"; // Import Sidebar

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar (Always Visible on Larger Screens) */}
      <Sidebar />

      {/* Main Content (Pushes Sidebar to Right) */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen md:ml-64">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
