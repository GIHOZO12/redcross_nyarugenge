import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Edit_announcement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("📢 Fetching:", `http://127.0.0.1:8000/edit_announcement/${id}/`);
    
    axios.get(`http://127.0.0.1:8000/edit_announcement/${id}/`, { withCredentials: true }) // ✅ Remove extra slash
      .then((res) => {
        console.log("✅ Data received:", res.data);
        setAnnouncement(res.data);
      })
      .catch((error) => console.error("❌ Error fetching data:", error.response?.data || error));
  }, [id]);
  
  

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    const formdata = new FormData();
    formdata.append('title', announcement.title);
    formdata.append('description', announcement.text); // Use text field for description

    // Send POST request to update the announcement
    axios.post(`http://127.0.0.1:8000/edit_announcement/${id}/`, formdata, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      })
    .then((response) => {
        console.log('Announcement updated successfully', response.data);
      setMessage("✅ Announcement updated successfully!");
      Swal.fire("updated","Announcement has been edited","success")
      navigate('/admin/announcement'); // Navigate back to the list of announcements
    })
    .catch((error) => {
      console.error('Error updating announcement', error);
      setMessage("❌ Error updating announcement.");
    });
  };

  if (!announcement) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className='min-h-screen'>
        <header>
          <h1 className='text-3xl font-semibold text-blue-800'>Edit Announcement</h1>
        </header>
        <section className="mt-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                value={announcement.title}
                onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                className="p-2 w-full border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter announcement title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                value={announcement.text}
                onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                className="p-2 w-full border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                placeholder="Enter announcement description"
              />
            </div>
            {message && (
              <div className={`p-2 text-white ${message.includes('❌') ? 'bg-red-500' : 'bg-green-500'}`}>
                {message}
              </div>
            )}
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Update
            </button>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
};

export default Edit_announcement;
