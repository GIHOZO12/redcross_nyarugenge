// User_info.js
import React, { useState } from 'react';
import Navdata from './Navdata'; // Import the Navdata component
import RwandaRedCrossForm from './Memberform';
import Contribution from './Contribution';

const User_info = () => {
  // State to track the active list item
  const [activeItem, setActiveItem] = useState('Complete profile');

  // List of items
  const items = ['Complete profile', 'Fill member form', 'Your contribution'];

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <section className='bg-white rounded-lg shadow-md p-6'>
        <ul className='flex gap-6'>
          {items.map((item, index) => (
            <li
              key={index}
              className={`flex-1 text-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                activeItem === item
                  ? 'bg-red-500 text-white font-semibold' // Active state
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Inactive state
              }`}
              onClick={() => setActiveItem(item)} // Set active item on click
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Conditionally render the Navdata form */}
        {activeItem === 'Complete profile' && <Navdata />}
        {activeItem === 'Fill member form' && <RwandaRedCrossForm />}
        {activeItem === 'Your contribution' && <Contribution />}
      </section>
    </div>
  );
};

export default User_info;