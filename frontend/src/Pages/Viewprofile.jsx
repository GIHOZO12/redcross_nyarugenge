import React, { useEffect, useState } from 'react';
import { refreshToken, isTokenExpired } from '../Components/auth';  // Import the utility functions
import User_info from './Profile/User_info';

const Viewprofile = () => {
  const [Profile, setProfile] = useState(null);
  const [changeprofilepicture, setchangeprofilepicture]=useState(false)
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setchangeprofilepicture({ profile_image: file });
      };
    }
  };
 const handleSubmit = async () => {
  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  formData.append('profile_image', changeprofilepicture.profile_image);

  try {
    const response = await fetch('https://gihozo.pythonanywhere.com/api/change_profile_picture/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Profile picture updated successfully:', data);
      setchangeprofilepicture(false);
      fetchCurrentUser(); // Refresh the profile data
    } else {
      console.error('Failed to update profile picture');
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
  }
};
  const fetchCurrentUser = async () => {
    let token = localStorage.getItem('access_token');

    // Check if the token is expired
    if (token && isTokenExpired(token)) {
      console.log('Token expired. Refreshing token...');
      token = await refreshToken();  // Refresh the token
      if (!token) {
        console.error('Failed to refresh token. Redirecting to login...');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token'); // Redirect to login page
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
          <div>
          <img
                src={Profile.profile_image ? `https://gihozo.pythonanywhere.com/${Profile.profile_image}` : '../assets/logo.png'}
                alt='profile_pic'
                className='w-20 h-20 mx-auto mb-5 rounded-full'
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if the fallback image also fails
                  e.target.src = '../assets/logo.png';
                }}
              />
              <button className='bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded-full'
              onClick={()=>setchangeprofilepicture(!changeprofilepicture)}
              >Change Profile Picture</button>
              <div className='p-2'>
             {changeprofilepicture && <><input type='file' onChange={(e) => handleImageChange(e)} className='p-2' />
             <button className='bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded-full'
                  onClick={() => handleSubmit()}
                >Save Changes</button></>
             }
             </div>
          </div>
              <div>
                <h2 className='text-center text-2xl font-bold text-red-500'>
                  <span>username:</span> {Profile.username}
                </h2>
                <p className='text-center text-gray-600'>
                  <span>Email:</span> {Profile.email}
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