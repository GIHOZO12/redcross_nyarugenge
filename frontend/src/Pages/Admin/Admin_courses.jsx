import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import axios from 'axios';

const Admin_general_info = () => {
    const [general_info, setGeneralInfo] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('access_token'); // Retrieve the token from local storage
        axios.get("https://gihozo.pythonanywhere.com/api/admin_all_generalinformation/", {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        })
        .then((response) => {
            setGeneralInfo(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    const handleDownloadSingleUserInfo = (userId) => {
        const token = localStorage.getItem('access_token');
        axios.get(`https://gihozo.pythonanywhere.com/api/download_single_user_info/${userId}/`, {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `user_${userId}_info.pdf`); // Change file extension to .pdf
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch((error) => {
            console.log(error);
        });
    };
    return (
        <AdminLayout>
            <div className='p-6 md:ml-64 min-h-screen bg-gray-100'>
                <header>
                    <h1>General Information</h1>
                </header>
                <section>
                    <table className=" w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Gender</th>
                                <th>Download Info</th>
                            </tr>
                        </thead>
                        <tbody>
    {general_info.map((item, index) => (
        <tr key={index}>
            <td>{item.id}</td>
            <td>{item.username}</td> {/* Now using item.username directly */}
            <td>{item.gender}</td>
            <td>
                <button
                    onClick={() => handleDownloadSingleUserInfo(item.id)}
                    className='bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                    Download
                </button>
            </td>
        </tr>
    ))}
</tbody>
                    </table>
                </section>
            </div>
        </AdminLayout>
    );
};

export default Admin_general_info;