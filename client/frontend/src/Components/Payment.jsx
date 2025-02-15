// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AppContext } from '../AppContext/Appcontext';
import { Link } from 'react-router-dom';
import aitelLogo from '../assets/aitel.png'
import mtnLogo from '../assets/images.png'

const Payment = () => {
    const [showpayment,setshowpayment]=useState(true)
  return (
    <>
    {showpayment && (
    <div className='fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative'>
        <FaTimes className='absolute top-4 right-4 cursor-pointer text-red-500 text-xl' onClick={()=>setshowpayment(false)} />
        <h1 className='text-2xl font-bold text-center mb-4'>Donate</h1>
        <p className='text-center mb-6'>Please select a Donate method</p>
        <div className='flex flex-col gap-3'>
            <div>
       <Link to="https://www.paypal.com/donate/?hosted_button_id=YP2PNJJ9SGTYE">  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full'>Donate with PayPal</button>
       </Link> 
       </div>
       <div className='flex bg-gray-500 hover:bg-gray-700 rounded-full'>
        <img src={aitelLogo} width={50} height={50}/>
          <button className=' text-white font-bold py-2 px-4  w-full'>Donate with Airtel</button>
          </div>
<div className='flex bg-yellow-500 hover:bg-yellow-700 rounded-full '>
    <img src={mtnLogo} width={50} height={50}/>
          <button className=' text-white font-bold py-2 px-4  w-full'>Donate with Momo</button>
          </div>
        </div>
      </div>
    </div>
)}
</>
  );
};

export default Payment;