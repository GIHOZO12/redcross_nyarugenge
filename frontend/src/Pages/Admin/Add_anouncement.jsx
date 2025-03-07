import React, { useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import axios from 'axios';

const Add_anouncement = () => {
  const [announcement, setAnnouncement] = useState({ title: '', text: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement({ ...announcement, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', announcement.title);
    data.append('text', announcement.text);

    try {
      const response = await axios.post("https://gihozo.pythonanywhere.com/admin_add_announcement/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": getCookie("csrftoken"),  // ✅ Ensure CSRF token is sent
        }
      });

      setMessage(response.data.message);
      setAnnouncement({ title: '', text: '' });
    } catch (error) {
      console.error("❌ Error adding announcement:", error.response?.data || error);
      setMessage("❌ Error adding announcement");
    }
  };

  // ✅ Function to get CSRF token from cookies
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
      <div className='p-6 md:ml-64 min-h-screen bg-gray-100'>
        <div className='w-full max-w-lg bg-white rounded-lg flex flex-col p-6'>
          <header>
            <h1 className='text-3xl font-bold mb-8'>Add Announcement</h1>
          </header>
          {message && <p className="text-green-600 text-center">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='title'>Title</label>
              <input 
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700' 
                id='title' 
                name="title"  // ✅ Ensure the name matches the backend key
                type='text' 
                required 
                placeholder='Title' 
                value={announcement.title}
                onChange={handleChange} 
              />
            </div>

            <div className='mt-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='text'>Description</label>
              <textarea 
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700' 
                id='text' 
                name="text"  // ✅ Use "text" instead of "description"
                required 
                placeholder='Description' 
                value={announcement.text}
                onChange={handleChange} 
              />
            </div>

            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6' type='submit'>
              Add Announcement
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Add_anouncement;
