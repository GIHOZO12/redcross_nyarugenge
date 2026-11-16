import React from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import { membershipService, getErrorMessage } from '../../api';
import { useFetch } from '../../hooks';

const ConfirmMembership = () => {
    const {
        data: requestedMembership,
        refetch: fetchMembershipRequests,
    } = useFetch(membershipService.allRequests, [], []);

    const confirmMembership = (requestId) => {
        membershipService.approve(requestId)
            .then(() => {
                // Refresh the list after successful approval
                fetchMembershipRequests();
                alert('Membership approved successfully!');
            })
            .catch((error) => {
                alert(getErrorMessage(error, 'Error approving membership'));
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
                                <th className="py-2 px-4 border">email</th>
                                <th className="py-2 px-4 border">Message</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestedMembership.map((request, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border">{request.username}</td>
                                    <td className="py-2 px-4 border">{request.email}</td>
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