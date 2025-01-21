import React, { useState } from 'react';
import Logo from '../assets/logo.png';
import { FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className='fixed top-0 left-0 w-full bg-red-500 z-50'>
      <div className='flex justify-between items-center py-2 px-4'>
        <div>
          <img src={Logo} alt='Logo' className='h-10 w-auto' />
        </div>
        <nav>
          <ul className='flex gap-4 mr-2'>
            <li className='text-white cursor-pointer'>Home</li>
            <li
              className='text-white relative cursor-pointer'
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className='flex items-center'>
                Families <FaChevronDown className='ml-1' />
              </div>
              {isDropdownOpen && (
                <ul className='absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg'>
                  <li className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>
                    Humanity
                  </li>
                  <li className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>
                    Neutrality
                  </li>
                  <li className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>
                    Partiality
                  </li>
                  <li className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>
                    Unity
                  </li>
                  <li className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>
                    Universality
                  </li>
                </ul>
              )}
            </li>
            <li className='text-white cursor-pointer'>Update</li>
            <li className='text-white cursor-pointer'>Contact</li>
          </ul>
        </nav>
        <div className='flex gap-3'>
          <button className='bg-black text-white px-3 py-1 rounded'>Sign In</button>
          <button className='bg-black text-white px-3 py-1 rounded'>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
