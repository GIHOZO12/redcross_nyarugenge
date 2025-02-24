import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import axios from 'axios';

const RedcrossAdmin = () => {
  const [data, setData] = useState({ family: 0, member: 0, activities: 0 });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/admin_info/")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-900">Welcome to UR Nyarugenge Red Cross Admin Dashboard</h1>
        <p className="mt-4 text-gray-700">Manage users, activities, and more from here.</p>
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow flex flex-row gap-14">
       
        <p className="mt-2 text-gray-700 bg-green-500 rounded-lg p-4">Total Families <span className='flex flex-col'>{data.family}</span> </p>
        <p className="mt-2 text-gray-700 bg-yellow-300 rounded-lg p-4">Total Members  <span className='flex flex-col'>{data.member}</span></p>
        <p className="mt-2 text-gray-700 bg-purple-500  rounded-lg p-4">Total Activities <span className='flex flex-col'>{data.activities}</span></p>
        <p className="mt-2 text-gray-700 bg-orange-400  rounded-lg p-4">Total fellowership <span className='flex flex-col'>{data.Fellowership}</span></p>
        <p className="mt-2 text-white bg-blue-950  rounded-lg p-4">Total Announcement <span className='flex flex-col'>{data.announcement_count}</span></p>
      </div>
    </AdminLayout>
  );
};

export default RedcrossAdmin;
