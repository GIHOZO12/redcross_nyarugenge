import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';

const ConfirmMembership = () => {
    const [requestedMembership, setRequestedMembership] = useState([]);
    
    useEffect(() => {
        fetchMembershipRequests();
    }, []);

    const fetchMembershipRequests = () => {
        axios.get("https://gihozo.pythonanywhere.com/api/all_requested_memberships/")
            .then((response) => {
                setRequestedMembership(response.data);
            })
            .catch((error) => {
                console.error("Error fetching requests:", error);
            });
    };

    const confirmMembership = (requestId) => {
        axios.post(`https://gihozo.pythonanywhere.com/api/approve_request_membership/${requestId}/`)
            .then((response) => {
                // Refresh the list after successful approval
                console.log(response.data);
                fetchMembershipRequests();
                alert('Membership approved successfully!');
            })
            .catch((error) => {
                console.error("Error approving membership:", error);
                alert('Error approving membership');
            });
    };

    return (
        <AdminLayout>
            <div className="p-4">
                <header className="text-2xl font-bold mb-4">Confirm Membership</header>
                <section className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 border">Username</th>
                                <th className="py-2 px-4 border">Message</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestedMembership.map((request, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border">{request.username}</td>
                                    <td className="py-2 px-4 border">{request.message}</td>
                                    <td className="py-2 px-4 border">
                                        <button 
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                                            onClick={() => confirmMembership(request.id)}
                                            disabled={request.status === 'approved'}
                                        >
                                            {request.status === 'approved' ? 'Approved' : 'Confirm'}
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

export default ConfirmMembership;