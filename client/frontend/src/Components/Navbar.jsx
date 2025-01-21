// eslint-disable-next-line no-unused-vars
import React from 'react'
import Logo from '../assets/logo.png'

const Navbar = () => {
  return (
    <div className='bg-red-500 flex justify-between items-center'>
        <div>
            <img src={Logo} alt='image not found' width={80} height={80}/>
        </div>
        <nav>
        <ul className='flex gap-4 mr-2'>
            <li className='text-white'>Home</li>
            <li className='text-white'>Families</li>
            <li className='text-white'>Update</li>
            <li className='text-white'>Contact</li>
        </ul>
        </nav>
        <div className='flex gap-3 '>
            <button className='bg-black text-white p-2 rounded w-full '>SignIn</button>
            <button className='bg-black text-white p-2 rounded w-full '>Register</button>
        </div>
    </div>
  )
}

export default Navbar