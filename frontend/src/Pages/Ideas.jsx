import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { messagesService, authService, getErrorMessage } from '../api';

const Ideas = () => {
  const [message, setMessage] = useState({ name: '', email: '', description: '' });
  const [data, setData] = useState('');

  // Prime Django's CSRF cookie; the API client attaches the header itself.
  useEffect(() => {
    authService.fetchUserToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage({ ...message, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await messagesService.send({
        name: message.name,
        email: message.email,
        description: message.description,
      });

      // Reset the form fields
      setMessage({ name: '', email: '', description: '' });
      setData(response?.message || '');
      Swal.fire('Success', 'Idea added successfully', 'success');

      // Optional: Reset the form using DOM (fallback)
      e.target.reset();
    } catch (error) {
      const text = getErrorMessage(error, 'Error adding idea');
      setData(text);
      Swal.fire('Error', text, 'error');
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