import React from 'react';

const RwandaRedCrossForm = () => {
  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <section className=' p-8 max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-red-600'>RWANDA RED CROSS</h1>
          <h2 className='text-xl text-gray-700'>UR NYARUGENGE SECTION</h2>
        </div>

        {/* General Information Section */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>GENERAL INFORMATION</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Names</label>
              <input
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                placeholder='Enter your full names'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>NID nbr / Passport</label>
              <input
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                placeholder='Enter NID or Passport number'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Gender</label>
              <select className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'>
                <option value='M'>Male</option>
                <option value='F'>Female</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Department</label>
              <input
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                placeholder='Enter your department'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Email</label>
              <input
                type='email'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                placeholder='Enter your email'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Regno</label>
              <input
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                placeholder='Enter UR number'
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>ADDRESS</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Province</label>
              <input
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                placeholder='Enter province'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>District</label>
              <input
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                placeholder='Enter district'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Sector</label>
              <input
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                placeholder='Enter sector'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Village</label>
              <input
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                placeholder='Enter village'
              />
            </div>
          </div>
        </div>

        {/* Blood Donation Section */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>BLOOD DONATION</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Have you ever donated blood?</label>
              <select className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>If Yes, how many times?</label>
              <input
                type='number'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                placeholder='Enter number of times'
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className='text-center flex justify-between'>
          <button
            type='submit'
            className='bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
          >
            Send you information
          </button>
          <button
            type='submit'
            className='bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
          >
    Download proof of registration
          </button>
        </div>
      </section>
    </div>
  );
};

export default RwandaRedCrossForm;