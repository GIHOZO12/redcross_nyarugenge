import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { announcementsService, toFormData, getErrorMessage } from '../../api';

const Edit_announcement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    announcementsService.getForEdit(id)
      .then(setAnnouncement)
      .catch((error) => setMessage(getErrorMessage(error)));
  }, [id]);
  
  

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    const formdata = toFormData({
      title: announcement.title,
      description: announcement.text, // Use text field for description
    });

    announcementsService.update(id, formdata)
      .then(() => {
        setMessage("✅ Announcement updated successfully!");
        Swal.fire("updated","Announcement has been edited","success")
        navigate('/admin/announcement'); // Navigate back to the list of announcements
      })
      .catch((error) => {
        setMessage(`❌ ${getErrorMessage(error, 'Error updating announcement.')}`);
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
