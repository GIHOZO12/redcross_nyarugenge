// eslint-disable-next-line no-unused-vars
import React from 'react'
import Image from  "../assets/Myimage.jpg"

const Header = () => {
  return (
    <div className='relative'>
   <img src={Image} alt='image not fopund'/>
   <div className='absolute top-[500px] left-[18rem] '>
   <h1 className='text-white text-center'>welcome to RRC Nyarugenge C. Youth s</h1>
   <p className='text-white text-center'>we are powered family commited and passionate to Humanity activities</p>
   </div>
    </div>
  )
}

export default Header