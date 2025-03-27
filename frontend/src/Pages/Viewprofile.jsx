import React, { useContext, useEffect, useState } from 'react';
import { refreshToken, isTokenExpired } from '../Components/auth';
import User_info from './Profile/User_info';
import { AppContext } from '../AppContext/Appcontext';

const Viewprofile = () => {
  const [Profile, setProfile] = useState(null);
  const [changeprofilepicture, setchangeprofilepicture] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState(null);
  const { user } = useContext(AppContext);

  // Debug: Verify component renders
  console.log("Viewprofile component rendered");

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
        fetchCurrentUser();
      } else {
        console.error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit request button clicked"); // Debugging step 1

    const token = localStorage.getItem('access_token');
    if (!token) {
        alert('Please log in first');
        return;
    }

    try {
        setRequestStatus('loading');
        console.log("Sending request with message:", requestMessage); // Debugging step 2

        const response = await fetch('http://127.0.0.1:8000/api/request_membership/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: requestMessage }),
        });

        const data = await response.json();
        console.log("API Response:", data); // Debugging step 3

        if (!response.ok) {
            throw new Error(data.detail || 'Request failed');
        }

        setRequestStatus('success');
        setShowRequestForm(false);
        setRequestMessage('');
        fetchCurrentUser();
        
    } catch (error) {
        console.error('Request failed:', error);
        setRequestStatus('error');
        alert(`Error: ${error.message}`);
    }
};


  const fetchCurrentUser = async () => {
    let token = localStorage.getItem('access_token');

    if (token && isTokenExpired(token)) {
      console.log('Token expired. Refreshing token...');
      token = await refreshToken();
      if (!token) {
        console.error('Failed to refresh token. Redirecting to login...');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
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
            <div className='flex flex-col sm:flex-row justify-between items-center'>
              <div>
                <img
                  src={Profile.profile_image ? `https://gihozo.pythonanywhere.com/${Profile.profile_image}` : '../assets/logo.png'}
                  alt='profile_pic'
                  className='w-20 h-20 mx-auto mb-5 rounded-full'
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '../assets/logo.png';
                  }}
                />
                <button 
                  className='bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded-full'
                  onClick={() => setchangeprofilepicture(!changeprofilepicture)}
                >
                  Change Profile Picture
                </button>
                <div className='p-2'>
                  {changeprofilepicture && (
                    <>
                      <input 
                        type='file' 
                        onChange={(e) => handleImageChange(e)} 
                        className='p-2' 
                        accept="image/*"
                      />
                      <button 
                        className='bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded-full mt-2'
                        onClick={() => handleSubmit()}
                      >
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h2 className='text-center text-2xl font-bold text-red-500'>
                  <span>username:</span> {Profile.username}
                </h2>
                <p className='text-center text-gray-600'>
                  <span>Email:</span> {Profile.email}
                </p>
                <p className='text-center text-gray-600'>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {user.is_authenticated && (user.role === "Member" || user.role === "admin" || user.is_superuser) && (
        <User_info/> 
      )}

      {/* Show request button only for non-members */}
      {user.is_authenticated && !(user.role === "Member" || user.role === "admin" || user.is_superuser) && (
        <div className='flex flex-col items-center pt-16'>
          <button 
            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mb-4'
            onClick={() => {
              console.log("Request membership button clicked");
              setShowRequestForm(true);
              setRequestStatus(null);
            }}
          >
            Request membership
          </button>

          {requestStatus === 'error' && (
            <p className='text-red-500'>There was an error submitting your request. Please try again.</p>
          )}
        </div>
      )}

      {/* Membership request form */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Membership Request</h2>
            <form onSubmit={handleRequestSubmit}>
              <div className="mb-3">
                <label className="block text-gray-700 mb-2" htmlFor="name">Your name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  value={user.username}
                  disabled
                />
              </div> 
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="message">
                  Why do you want to become a member? at least 5 characters
                </label>
                <textarea
                  id="message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="4"
                  placeholder="Please explain why you want to join in at least 5 characters"
                  value={requestMessage}
                  onChange={(e) => {
                    
                    setRequestMessage(e.target.value);
                  }}
                  required
                  minLength="20"
                  placeholder="Please explain why you want to join"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setShowRequestForm(false);
                    setRequestMessage('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                  disabled={requestMessage.length < 5 || requestStatus === 'loading'}
                >
                  {requestStatus === 'loading' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success modal */}
      {requestStatus === 'success' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h3 className="text-green-500 text-xl font-bold mb-4">Success!</h3>
            <p>Your membership request has been submitted successfully.</p>
            <button
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded"
              onClick={() => setRequestStatus(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewprofile;