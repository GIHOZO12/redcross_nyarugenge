// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Add_activities = () => {
  const { familyName } = useParams();
  const [activityName, setActivityName] = useState("");
  const [activityText, setActivityText] = useState("");
  const [activityImage, setActivityImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate =useNavigate()
  const [csrfToken, setCsrfToken] = useState("");

  // Fetch CSRF token from Django
  useEffect(() => {
     axios.get("http://127.0.0.1:8000/get-csrf-token/", { withCredentials: true })
       .then((res) => setCsrfToken(res.data.csrfToken))
      .catch((err) => console.error("CSRF token error:", err));
  }, []);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    
    if (!activityName || !activityText || !activityImage) {
      setError("All fields are required");
      return;
    }
  
    const formData = new FormData();
    formData.append("family_name", familyName);
    formData.append("title", activityName);  // Ensure key names match backend
    formData.append("text", activityText);  // Ensure key names match backend
    formData.append("activity_image", activityImage);  // Ensure key names match backend
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/create_activity/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,  // Include CSRF token
          },
          withCredentials: true,  // Allow cookies to be sent with the request
        }
      );
  
      if (response.data.status) {
        setSuccess("Activity added successfully!");
        navigate(response.data.redirect_url);

        setActivityName("");
        setActivityText("");
        setActivityImage(null);
        setError("");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error adding activity", error);
      setError("Error adding activity");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Add Activities</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && <div className="text-green-500 text-center mb-4">{success}</div>}
        <form onSubmit={handleOnSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="activity_title" className="block text-sm font-medium text-gray-700">
                Activity Title
              </label>
              <input
                onChange={(e) => setActivityName(e.target.value)}
                type="text"
                name="title"
                id="activity_title"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Enter activity title"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="activity_text" className="block text-sm font-medium text-gray-700">
                Activity Text
              </label>
              <textarea
                onChange={(e) => setActivityText(e.target.value)}
                name="text"
                id="activity_text"
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Describe the activity"
              ></textarea>
            </div>

            <div className="mb-6">
              <label htmlFor="activity_image" className="block text-sm font-medium text-gray-700">
                Activity Image
              </label>
              <input
                onChange={(e) => setActivityImage(e.target.files[0])}
                type="file"
                accept="image/*"
                name="activity_image"
                id="activity_image"
                className="mt-1 block w-full text-gray-700 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-red-100 file:text-red-600 hover:file:bg-red-200"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add_activities;
