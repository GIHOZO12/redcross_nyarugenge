import React, { useState } from 'react';

const Navdata = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    if (profilePic) {
      formData.append('profile_image', profilePic);
    }
  
    try {
      const response = await fetch('https://gihozo.pythonanywhere.com/api/add_user_info/', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,  // Include the access token
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Profile updated successfully:', data);
        setFirstName('')
        setLastName('')
        setProfilePic(null)
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className='p-4'>
      <section className='p-6 max-w-2xl mx-auto'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
          Complete Your Profile
        </h2>
        <form className='space-y-6' onSubmit={handleSubmit}>
          {/* First Name Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              First Name:
            </label>
            <input
              type='text'
              name='fname'
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
              placeholder='Enter your first name'
            />
          </div>

          {/* Last Name Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Last Name:
            </label>
            <input
              type='text'
              name='lname'
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
              placeholder='Enter your last name'
            />
          </div>

          {/* Profile Picture Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Profile image</label>
            <input
              type='file'
              name='profile_pic'
              onChange={(e) => setProfilePic(e.target.files[0])}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type='submit'
              className='w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all'
            >
              Update profile
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Navdata;