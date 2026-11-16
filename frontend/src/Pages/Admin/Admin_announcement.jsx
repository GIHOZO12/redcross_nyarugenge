import React from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { announcementsService, getErrorMessage } from '../../api';
import { useFetch } from '../../hooks';

const Admin_announcement = () => {
    const navigate = useNavigate();
    const { data: anounce, setData: setanounce } = useFetch(
        announcementsService.adminList,
        [],
        []
    );

    // Delete announcement
    const deleteAnnounce = (id) => {
        if (!id) {
            console.error("❌ Error: Announcement ID is undefined");
            return;
        }

        console.log("🛠️ Attempting to delete announcement with ID:", id);

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                announcementsService.remove(id)
                .then(data => {
                    if (data && data.status === false) {
                        Swal.fire("Error!", data.message || "Delete failed.", "error");
                        return;
                    }
                    setanounce(current => current.filter(item => item.id !== id)); // Remove deleted item from the UI
                    Swal.fire("Deleted!", "Your announcement has been deleted.", "success");
                })
                .catch(error => {
                    Swal.fire("Error!", getErrorMessage(error, "Delete failed."), "error");
                });
            }
        });
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <header className="flex flex-col sm:flex-col md:flex-row justify-between items-center mb-6 p-3">
                    <div className='m-1'>
                        <h1 className="text-3xl font-semibold text-blue-800">Redcross updating page</h1>
                        <p className="mt-2 text-gray-600">Here are the latest updates of Redcross</p>
                    </div>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => navigate("/admin/addannouncement")}
                    >
                        Add Announcement
                    </button>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {anounce.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                        >
                            <h2 className="text-xl font-semibold text-blue-700 mb-2">
                                <span className='text-black'>Title:</span>{item.title}
                            </h2>
                            <div>
                                <h5 className="text-gray-700 text-sm">
                                    <span className='text-black text-xl font-semibold'>Description:</span>{item.text}
                                </h5>
                                <p className="text-gray-700 text-sm">
                                    <span className='text-black text-xl font-semibold'>Date Created:</span>{item.created}
                                </p>
                                <div className='p-3'>
                                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors mr-2"
                                     onClick={()=>navigate(`/edit_announcement/${item.id}/`)}
                                    
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        onClick={() => deleteAnnounce(item.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Admin_announcement;
