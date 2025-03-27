import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { refreshToken, isTokenExpired } from '../../Components/auth';

const RwandaRedCrossForm = () => {
  const [formData, setFormData] = useState({
    names: '',
    nationalId: '',
    gender: 'Male',
    department: '',
    email: '',
    regno: '',
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    donated: 'Yes',
    donated_times: 0,
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [existingData, setExistingData] = useState(null);
  const [nationalIdError, setNationalIdError] = useState(''); // State for national ID error

  const fetchCurrentUser = async () => {
    let token = localStorage.getItem('access_token');
    if (token && isTokenExpired(token)) {
      console.log('Token expired. Refreshing token...');
      token = await refreshToken();
      if (!token) {
        console.error('Failed to refresh token. Redirecting to login...');
        return;
      }
    }

    try {
      const response = await axios.get('https://gihozo.pythonanywhere.com/api/current_user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data);
      fetchExistingData(response.data.id); // Fetch existing data for the current user
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchExistingData = async (userId) => {
    try {
      const response = await axios.get(`https://gihozo.pythonanywhere.com/api/edit_general_information/${userId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setExistingData(response.data);
      setFormData({
        names: response.data.name,
        nationalId: response.data.nationalId,
        gender: response.data.gender,
        department: response.data.department,
        email: response.data.email,
        regno: response.data.regno,
        province: response.data.address.province,
        district: response.data.address.district,
        sector: response.data.address.sector,
        cell: response.data.address.cell,
        village: response.data.address.village,
        donated: response.data.blood_donated.donated,
        donated_times: response.data.blood_donated.donated_times,
      });
    } catch (error) {
      console.error('Error fetching existing data:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = type === 'checkbox' ? checked : value;
    if (name === 'nationalId' || name === 'donated_times') {
      updatedValue = Number(value);
    }
    setFormData({
      ...formData,
      [name]: updatedValue,
    });

    // Clear error when user types in the national ID field
    if (name === 'nationalId') {
      setNationalIdError('');
    }
  };

  const checkNationalIdExists = async (nationalId) => {
    try {
      const response = await axios.get(`https://gihozo.pythonanywhere.com/api/check_national_id/?nationalId=${nationalId}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking national ID:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      console.error('Current user not available');
      return;
    }

    // Check if national ID exists (only for new submissions, not updates)
    if (!existingData) {
      const idExists = await checkNationalIdExists(formData.nationalId);
      if (idExists) {
        setNationalIdError('This national ID is already registered in our system.');
        Swal.fire({
          title: 'Error!',
          text: 'This national ID is already registered in our system.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
    }

    try {
      if (existingData) {
        // Update existing data
        const response = await axios.put(
          `https://gihozo.pythonanywhere.com/api/edit_general_information/${currentUser.id}/`,
          {
            name: formData.names,
            nationalId: formData.nationalId,
            gender: formData.gender,
            department: formData.department,
            address: {
              province: formData.province,
              district: formData.district,
              sector: formData.sector,
              cell: formData.cell,
              village: formData.village,
            },
            blood_donated: {
              donated: formData.donated,
              donated_times: formData.donated_times,
            },
          },
          {
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        Swal.fire({
          title: 'Information Updated Successfully!',
          text: 'Your information has been updated.',
          icon: 'success',
          confirmButtonText: 'Download Proof',
          confirmButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            handleDownloadProof();
          }
        });
        setFormData({
          names: '',
          nationalId: '',
          gender: 'Male',
          department: '',
          email: '',
          regno: '',
          province: '',
          district: '',
          sector: '',
          cell: '',
          village: '',
          donated: 'Yes',
          donated_times: 0,
        });
      } else {
        // Submit new data
        const response = await axios.post(
          'https://gihozo.pythonanywhere.com/api/general_information/',
          {
            user: currentUser.id,
            name: formData.names,
            nationalId: formData.nationalId,
            gender: formData.gender,
            department: formData.department,
            address: {
              user: currentUser.id,
              province: formData.province,
              district: formData.district,
              sector: formData.sector,
              cell: formData.cell,
              village: formData.village,
            },
            blood_donated: {
              user: currentUser.id,
              donated: formData.donated,
              donated_times: formData.donated_times,
            },
          },
          {
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          }
        );
        Swal.fire({
          title: 'Form Submitted Successfully!',
          text: 'Click below to download your proof of registration.',
          icon: 'success',
          confirmButtonText: 'Download Proof',
          confirmButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            handleDownloadProof();
          }
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      // Check if the error is about duplicate national ID
      if (error.response?.data?.nationalId) {
        setNationalIdError(error.response.data.nationalId[0]);
        Swal.fire({
          title: 'Error!',
          text: error.response.data.nationalId[0],
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while submitting the form. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleDownloadProof = async () => {
    try {
      const response = await axios.get(
        `https://gihozo.pythonanywhere.com/api/proof_of_registration/${currentUser.id}/`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'proof_of_registration.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading proof:', error.response?.data || error.message);
    }
  };

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <section className='p-8 max-w-4xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-red-600'>RWANDA RED CROSS</h1>
          <h2 className='text-xl text-gray-700'>UR NYARUGENGE SECTION</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>GENERAL INFORMATION</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Names</label>
                <input
                  type='text'
                  name='names'
                  value={formData.names}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  placeholder='Enter your full names'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>NID nbr / Passport</label>
                <input
                  type='number'
                  name='nationalId'
                  value={formData.nationalId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${nationalIdError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder='Enter NID or Passport number'
                />
                {nationalIdError && (
                  <p className="mt-1 text-sm text-red-600">{nationalIdError}</p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Gender</label>
                <select
                  name='gender'
                  value={formData.gender}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                >
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Other'>Other</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Department</label>
                <input
                  type='text'
                  name='department'
                  value={formData.department}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  placeholder='Enter your department'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  placeholder='Enter your email'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Regno</label>
                <input
                  type='text'
                  name='regno'
                  value={formData.regno}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  placeholder='Enter UR number'
                />
              </div>
            </div>
          </div>

          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>ADDRESS</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Province</label>
                <input
                  type='text'
                  name='province'
                  value={formData.province}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  placeholder='Enter province'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>District</label>
                <input
                  type='text'
                  name='district'
                  value={formData.district}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  placeholder='Enter district'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Sector</label>
                <input
                  type='text'
                  name='sector'
                  value={formData.sector}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  placeholder='Enter sector'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Cell</label>
                <input
                  type='text'
                  name='cell'
                  value={formData.cell}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  placeholder='Enter cell'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Village</label>
                <input
                  type='text'
                  name='village'
                  value={formData.village}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  placeholder='Enter village'
                />
              </div>
            </div>
          </div>

          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>BLOOD DONATION</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Have you ever donated blood?</label>
                <select
                  name='donated'
                  value={formData.donated}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                >
                  <option value='Yes'>Yes</option>
                  <option value='No'>No</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>If Yes, how many times?</label>
                <input
                  type='number'
                  name='donated_times'
                  value={formData.donated_times}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                  placeholder='Enter number of times'
                />
              </div>
            </div>
          </div>

          <div className='text-center flex flex-col md:flex-row justify-between gap-4'>
            <button
              type='submit'
              className='bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
            >
              {existingData ? 'Update Your Information' : 'Send Your Information'}
            </button>
            {existingData && ( // Show the button only if existingData is truthy
              <button
                onClick={handleDownloadProof} // Call handleDownloadProof when clicked
                className='bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
              >
                Download Proof of Registration
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default RwandaRedCrossForm;