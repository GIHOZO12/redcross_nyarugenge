import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { authService, usersService, getErrorMessage } from '../../api';

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

  // The API client refreshes an expired access token on its own.
  const fetchCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return;
      setCurrentUser(user);
      fetchExistingData(user.id); // Fetch existing data for the current user
    } catch (error) {
      console.error('Error fetching current user:', getErrorMessage(error));
    }
  };

  const fetchExistingData = async (userId) => {
    try {
      const data = await usersService.getGeneralInformation(userId);
      setExistingData(data);
      setFormData({
        names: data.name,
        nationalId: data.nationalId,
        gender: data.gender,
        department: data.department,
        email: data.email,
        regno: data.regno,
        province: data.address.province,
        district: data.address.district,
        sector: data.address.sector,
        cell: data.address.cell,
        village: data.address.village,
        donated: data.blood_donated.donated,
        donated_times: data.blood_donated.donated_times,
      });
    } catch {
      // No record yet is the normal case for a first-time member.
      setExistingData(null);
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

  const checkNationalIdExists = (nationalId) =>
    usersService.isNationalIdTaken(nationalId);

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
        await usersService.updateGeneralInformation(currentUser.id, {
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
        });
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
        await usersService.createGeneralInformation({
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
        });
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
          text: getErrorMessage(error, 'An error occurred while submitting the form. Please try again.'),
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const handleDownloadProof = async () => {
    try {
      await usersService.downloadProofOfRegistration(
        currentUser.id,
        'proof_of_registration.pdf'
      );
    } catch (error) {
      Swal.fire('Error', getErrorMessage(error, 'Error downloading proof'), 'error');
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