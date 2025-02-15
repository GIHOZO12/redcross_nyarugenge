import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import axios from 'axios';

const Subscribenewsletter = () => {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/all_subscribes/")
            .then((res) => {
                setSubscriptions(res.data);
            })
            .catch((error) => {
                console.error("Error fetching data", error);
            });
    }, []);

    const handleReplayAll = () => {
        alert("Replaying all emails...");
        // Add logic to send emails here
    };

    return (
        <AdminLayout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscriptions</h1>
                    <button 
                        onClick={handleReplayAll} 
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        Replay All Emails
                    </button>
                </header>
                <section className="overflow-x-auto">
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-4">{item.id}</td>
                                    <td className="py-3 px-4">{item.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </AdminLayout>
    );
};

export default Subscribenewsletter;
