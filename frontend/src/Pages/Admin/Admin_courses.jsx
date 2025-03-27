import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import axios from 'axios';

const Admin_general_info = () => {
    const [general_info, setGeneralInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get(
                    "https://gihozo.pythonanywhere.com/api/admin_all_generalinformation/", 
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                setGeneralInfo(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownloadSingleUserInfo = async (userId) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(
                `https://gihozo.pythonanywhere.com/api/download_single_user_info/${userId}/`,
                {
                    responseType: 'blob',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `user_${userId}_info.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <AdminLayout>
            <div className='p-6 md:ml-14 min-h-screen bg-gray-50'>
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">General Information</h1>
                        <p className="text-gray-600">Manage all user general information</p>
                    </header>

                    {/* Table Section */}
                    <section className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {isLoading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading user data...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {general_info.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.username}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.gender.toLowerCase()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        onClick={() => handleDownloadSingleUserInfo(item.id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                    >
                                                        Download PDF
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Empty State */}
                    {!isLoading && general_info.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                            <p className="mt-1 text-sm text-gray-500">There are currently no general information records available.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Admin_general_info;