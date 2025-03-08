import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Ideas = () => {
  const [message, setMessage] = useState({ name: '', email: '', description: '' });
  const [data, setData] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token on component mount
  useEffect(() => {
    fetch('https://gihozo.pythonanywhere.com/user_get_token/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken);
      })
      .catch((error) => {
        console.error('Error fetching CSRF token:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage({ ...message, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfToken) {
      Swal.fire('Error', 'CSRF token missing. Please refresh the page.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', message.name);
    formData.append('email', message.email);
    formData.append('description', message.description);

    // Debugging: Log the form data before sending
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await axios.post(
        'https://gihozo.pythonanywhere.com/messages_info/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );

      // Reset the form fields
      setMessage({ name: '', email: '', description: '' });
      setData(response.data.message);
      Swal.fire('Success', 'Idea added successfully', 'success');

      // Optional: Reset the form using DOM (fallback)
      e.target.reset();
    } catch (error) {
      console.error('Error adding idea', error);
      setData('Error adding idea');
      Swal.fire('Error', 'Error adding idea', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Share Your Idea</h1>
        <p className="text-gray-600 text-center mb-6">We'd love to hear your idea</p>

        {data && <p className="text-green-600 text-center">{data}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={message.name}
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={message.email}
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Idea Textarea */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
              Your Idea
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={message.description}
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your idea..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Submit Idea
          </button>
        </form>
      </div>
    </div>
  );
};

export default Ideas;
