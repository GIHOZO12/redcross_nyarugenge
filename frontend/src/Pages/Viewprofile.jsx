import React, { useEffect, useState } from 'react';
import { refreshToken, isTokenExpired } from '../Components/auth';  // Import the utility functions
import User_info from './Profile/User_info';

const Viewprofile = () => {
  const [Profile, setProfile] = useState(null);

  const fetchCurrentUser = async () => {
    let token = localStorage.getItem('access_token');

    // Check if the token is expired
    if (token && isTokenExpired(token)) {
      console.log('Token expired. Refreshing token...');
      token = await refreshToken();  // Refresh the token
      if (!token) {
        console.error('Failed to refresh token. Redirecting to login...');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
         // Redirect to login page
        return;
      }
    }

    try {
      const response = await fetch('https://gihozo.pythonanywhere.com/api/current_user/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile Data:', data);
        setProfile(data);
      } else {
        console.error('Failed to fetch current user');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <div className='min-h-screen pt-16 pb-6'>
      <h1 className='text-xl font-bold p-5'>Profile Information</h1>
      <div className='flex pt-16'>
        <div className='w-full max-w-md bg-white rounded-lg p-5 shadow-lg'>
          {Profile && (
            <div className='flex justify-between items-center'>
              <img
                src={Profile.profile_image ? `https://gihozo.pythonanywhere.com${Profile.profile_image}` : '../assets/logo.png'}
                alt='profile_pic'
                className='w-20 h-20 mx-auto mb-5 rounded-full'
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if the fallback image also fails
                  e.target.src = '../assets/logo.png';
                }}
              />
              <div>
                <h2 className='text-center text-2xl font-bold text-red-500'>
                  <span>Name:</span> {Profile.username}
                </h2>
                <p className='text-center text-gray-600'>
                  <span>Email:</span> {Profile.email}
                </p>
                <p className='text-center text-gray-600'>
                  <span>Role:</span> {Profile.role}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <User_info/> 
    </div>
  );
};

export default Viewprofile;