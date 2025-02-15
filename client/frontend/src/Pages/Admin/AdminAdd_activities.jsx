import React, { useState } from "react";
import AdminLayout from '../../Layout/AdminLayout';
import axios from "axios";

const AddActivity = () => {
  const [activity, setActivity] = useState({ title: '', description: '', image: null });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity({ ...activity, [name]: value });
  };

  const handleFileChange = (e) => {
    setActivity({ ...activity, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("title", activity.title);
    data.append("description", activity.description);
    data.append("redcross_activities_image", activity.image);
  
    try {
      const csrfToken = getCookie("csrftoken");
      console.log("CSRF token:", csrfToken);
  
      const response = await axios.post("http://127.0.0.1:8000/admin/addactivities/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });
  
      setMessage(response.data.message);
      setActivity({ title: '', description: '', image: null });
    } catch (error) {
      console.error("Error adding activity:", error);
      setMessage("Error adding activity");
    }
  };

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen bg-gray-100 md:ml-64">
        <div className="w-full max-w-lg bg-white rounded-lg flex flex-col p-6">
          <header>
            <h1 className="text-3xl font-bold mb-8">Add Activity</h1>
          </header>
          {message && <p className="text-green-600 text-center">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="title" 
                name="title"
                type="text"
                required
                placeholder="Activity Title"
                value={activity.title}
                onChange={handleChange} 
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
              <textarea 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="description" 
                name="description"
                required
                placeholder="Activity Description"
                value={activity.description}
                onChange={handleChange} 
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="redcross_activities_image">Activity Image</label>
              <input
                type="file"
                name="redcross_activities_image"
                onChange={handleFileChange}
                className="w-full p-3 border rounded focus:outline-none"
                required
              />
            </div>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6" type="submit">
              Add Activity
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddActivity;