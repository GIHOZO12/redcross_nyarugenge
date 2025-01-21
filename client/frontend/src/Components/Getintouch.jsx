// eslint-disable-next-line no-unused-vars
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Getintouch = () => {
  return (
    <div className='bg-black text-white p-6'>
      <h1 className='text-center text-2xl font-bold mb-6'>Get in Touch</h1>
      <section className='flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0'>
        
        {/* Social Media Section */}
        <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6'>
          <h2 className='text-xl font-semibold'>Social Media</h2>
          <div className='flex  space-x-4'>
            <a href='#' className='text-2xl hover:text-blue-600'>
              <FaFacebook />
            </a>
            <a href='#' className='text-2xl hover:text-blue-400'>
              <FaTwitter />
            </a>
            <a href='#' className='text-2xl hover:text-pink-600'>
              <FaInstagram />
            </a>
            <a href='#' className='text-2xl hover:text-blue-700'>
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Our Partners Section */}
        <div className='flex flex-col space-y-2'>
          <h2 className='text-xl font-semibold'>Our Partners</h2>
          <h4 className='text-lg'>UR-CST</h4>
          <h4 className='text-lg'>Nyarugenge District</h4>
          <h4 className='text-lg'>Rwanda Redcross</h4>
        </div>

        {/* Newsletter Subscription Section */}
        <div className='flex flex-col items-center space-y-4'>
          <h2 className='text-xl font-semibold'>Subscribe</h2>
          <div className='flex flex-row'>
          <input
            type='email'
            placeholder='Enter your email'
            className='p-2 rounded-l text-black w-64'
          />
          <button className='bg-red-600 text-white py-2 px-6 rounded-r-full hover:bg-blue-700'>
            Subscribe
          </button>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Getintouch;
