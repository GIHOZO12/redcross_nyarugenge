// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AppContext } from '../AppContext/Appcontext';
import { Link } from 'react-router-dom';
import aitelLogo from '../assets/aitel.png';
import mtnLogo from '../assets/images.png';

const Payment = () => {
  const [showPayment, setShowPayment] = useState(true);
  const [showAirtel, setShowAirtel] = useState(false);
  const [showMtn, setShowMtn] = useState(false);

  return (
    <>
      {showPayment && (
        <div className='fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm'>
          <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md mx-4 relative'>
            <FaTimes
              className='absolute top-4 right-4 cursor-pointer text-red-500 text-xl'
              onClick={() => setShowPayment(false)}
            />
            <h1 className='text-2xl font-bold text-center mb-4'>Donate</h1>
            <p className='text-center mb-6'>Please select a Donate method</p>
            <div className='flex flex-col gap-3'>
              <div>
                <Link to='https://www.paypal.com/donate/?hosted_button_id=YP2PNJJ9SGTYE'>
                  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full'>
                    Donate with card
                  </button>
                </Link>
              </div>
              <div className='flex bg-gray-500 hover:bg-gray-700 rounded-full items-center'>
                <img src={aitelLogo} width={50} height={50} alt='Airtel Logo' />
                <button
                  className='text-white font-bold py-2 px-4 w-full'
                  onClick={() => {
                    setShowAirtel(!showAirtel);
                    setShowMtn(false);
                  }}
                >
                  Donate with Airtel
                </button>
              </div>
              {showAirtel && (
                <>
                  <p className='text-center'>Please enter your Airtel Money number to proceed</p>
                  <div className='flex flex-col gap-3'>
                    <span className='text-center'>+250 782 615 187 Mugwaneza Jacqline</span>
                    <input
                      type='text'
                      placeholder='Enter your Airtel Mobile Number'
                      className='bg-gray-100 rounded-lg py-2 px-4 w-full'
                    />
                    <input
                      type='number'
                      placeholder='Amount to donate'
                      className='bg-gray-100 rounded-lg py-2 px-4 w-full'
                    />
                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full'>
                      Donate
                    </button>
                  </div>
                </>
              )}
              <div className='flex bg-yellow-500 hover:bg-yellow-700 rounded-full items-center'>
                <img src={mtnLogo} width={50} height={50} alt='MTN Logo' />
                <button
                  className='text-white font-bold py-2 px-4 w-full'
                  onClick={() => {
                    setShowMtn(!showMtn);
                    setShowAirtel(false);
                  }}
                >
                  Donate with Momo
                </button>
              </div>
              {showMtn && (
                <>
                  <p className='text-center'>Please enter your Momo number to proceed</p>
                  <div className='flex flex-col gap-3'>
                    <span className='text-center mb-2'>+250 782 615 187 Mugwaneza Jacqline</span>
                    <input
                      type='text'
                      placeholder='Enter your Momo Mobile Number'
                      className='bg-gray-100 rounded-lg py-2 px-4 w-full'
                    />
                    <input
                      type='number'
                      placeholder='Amount to donate'
                      className='bg-gray-100 rounded-lg py-2 px-4 w-full'
                    />
                    <button className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full w-full'>
                      Donate
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
