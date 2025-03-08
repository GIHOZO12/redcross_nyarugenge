// Navdata.js
import React from 'react';

const Navdata = () => {
  return (
    <div className='p-4'>
      <section className='  p-6 max-w-2xl mx-auto'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
          Complete Your Profile
        </h2>
        <form className='space-y-6'>
          {/* First Name Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              First Name:
            </label>
            <input
              type='text'
              name='fname'
              required
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
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
              placeholder='Enter your last name'
            />
          </div>
          {/* profile picture Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>profile image</label>
            <input type='file' name='profile_pic' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all' />

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