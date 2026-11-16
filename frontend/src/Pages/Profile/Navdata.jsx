import React, { useState } from 'react';
import { usersService, toFormData, getErrorMessage } from '../../api';

const Navdata = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = toFormData({
      first_name: firstName,
      last_name: lastName,
      profile_image: profilePic,
    });

    try {
      await usersService.addUserInfo(formData);
      setFirstName('')
      setLastName('')
      setProfilePic(null)
      setStatus({ ok: true, text: 'Profile updated successfully.' });
    } catch (error) {
      setStatus({ ok: false, text: getErrorMessage(error, 'Failed to update profile.') });
    }
  };
  return (
    <div className='p-4'>
      <section className='p-6 max-w-2xl mx-auto'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
          Complete Your Profile
        </h2>
        {status && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              status.ok
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {status.text}
          </div>
        )}

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