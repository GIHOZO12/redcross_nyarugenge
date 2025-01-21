import React from 'react';
import { Fellowership } from '../Felloweship/Meeting';

const Latest = () => {
  return (
    <div>
      <h1 className='text-center text-xl'>Latest Fellowship</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-2 '>
        {Fellowership.map((item, index) => (
          <div key={index} className='bg-white p-4 rounded shadow border'>
            <img src={item.image} alt='Not found' className='w-full h-auto' />
            <div>
              <h2 className='text-lg font-semibold'>{item.title}</h2>
              <p className='text-gray-600'>{item.Description}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Latest;
