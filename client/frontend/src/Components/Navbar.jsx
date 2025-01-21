import React, { useState } from 'react';
import Logo from '../assets/logo.png';
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ onJoinClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full bg-red-500 z-50">
      <div className="flex justify-between items-center py-2 px-4">
        {/* Logo */}
        <div>
          <img src={Logo} alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-white text-2xl md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } absolute md:static top-14 left-0 w-full md:w-auto bg-red-500 md:flex md:gap-4 md:items-center`}
        >
          <ul className="flex flex-col md:flex-row gap-4 p-4 md:p-0">
            <li className="text-white cursor-pointer">Home</li>
            <li
              className="text-white relative cursor-pointer"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="flex items-center">
                Families <FaChevronDown className="ml-1" />
              </div>
              {/* Dropdown */}
              {isDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    Humanity
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    Neutrality
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    Partiality
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    Unity
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    Universality
                  </li>
                </ul>
              )}
            </li>
            <li className="text-white cursor-pointer">Update</li>
            <li className="text-white cursor-pointer">Contact</li>
          </ul>
        </nav>

        {/* Buttons (Always Visible) */}
        <div className="hidden md:flex gap-3">
          <button
            className="bg-black text-white px-3 py-1 rounded"
            onClick={onJoinClick}
          >
            Join us
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="flex flex-col gap-3 px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-4">
            <li className="text-white cursor-pointer">Home</li>
            <li className="text-white cursor-pointer">Families</li>
            <li className="text-white cursor-pointer">Update</li>
            <li className="text-white cursor-pointer">Contact</li>
          </ul>
          {/* Login and Register Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={onJoinClick}
            >
              Join us
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
