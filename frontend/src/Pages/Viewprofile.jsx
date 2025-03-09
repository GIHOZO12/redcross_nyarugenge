

// eslint-disable-next-line no-unused-vars
import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import User_info from './Profile/User_info'

const Viewprofile = () => {
  const [Profile,setProfile]=useState([])

  useEffect(() => {
    axios.get("https://gihozo.pythonanywhere.com/api/current_user/", {
      withCredentials: true 
    })
    .then((response) => {
      console.log("Profile Data:", response.data);
      setProfile(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data", error);
    });
  }, []);
  
  

  return (
 
    <div className='min-h-screen  pt-16 pb-6'>
            <h1 className='tetx-xl font-bold  p-5'> Profile information</h1>
            <div className='flex  pt-16'>
              <div className='w-full max-w-md bg-white rounded-lg p-5 shadow-lg'>
                 {Profile &&(
                  <div className='flex  justify-between items-center'>
                      <img src={Profile.profile_image} alt='profile_pic' className='w-20 h-20 mx-auto mb-5'></img>
                    <div>
                    <h2 className='text-center text-2xl font-bold text-red-500'><span>name:</span>{Profile.username}</h2>
                    <p className='text-center text-gray-600'>  <span>email:</span>{Profile.email}</p>
                    <p className='text-center text-gray-600'>  <span>role:</span>{Profile.role}</p>
                    </div>
                    </div>
                 )}
              </div>
      
            </div>
            <User_info/> 
   </div>
  )
}

export default Viewprofile
