import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-lg text-gray-700 mt-2">Page Not Found</p>
      <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
