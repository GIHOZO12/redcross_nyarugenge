// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import AdminLayout from "../../Layout/AdminLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminFellowership = () => {
    const navigate = useNavigate();
    const [fellowership, setFellowership] = useState([]);

    useEffect(() => {
        axios.get("https://gihozo.pythonanywhere.com/admin_fellowships/")
            .then((response) => {
                setFellowership(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Delete function with confirmation popup
    const handleDelete = (id) => {
        if (!id) {
            console.error("Error: Fellowship ID is undefined.");
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You are in danger of losing this fellowship!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`https://gihozo.pythonanywhere.com/admin_deleter_fellowship/${id}/`)
                    .then((response) => {
                        if (response.data.status) {
                            setFellowership(fellowership.filter(item => item.id !== id));
                            Swal.fire("Deleted!", "Fellowship has been deleted.", "success");
                        }
                    })
                    .catch((error) => {
                        console.error("Delete error:", error);
                        Swal.fire("Error!", "Something went wrong.", "error");
                    });
            }
        });
    };

    return (
        <AdminLayout>
            <div className="p-8">
                {/* Header Section */}
                <header className="flex flex-col sm:flex-col md:flex-row justify-between items-center mb-6">
                    <div className="m-5 sm:flex flex-col">
                        <h1 className="text-3xl font-semibold text-blue-800">Redcross Fellowership</h1>
                        <p className="mt-2 text-gray-600">Here are all Redcross fellowships</p>
                    </div>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => navigate('/admin/add_fellowership')}
                    >
                        Add Fellowership
                    </button>
                </header>

                {/* Fellowship List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fellowership.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                            <img src={item.fellowership_image} alt={item.title} className="w-full h-48 object-cover rounded-md mb-4" />
                            <div>
                                <h2 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h2>
                                <p className="text-gray-700 text-sm">{item.description}</p>
                            </div>
                            <div className="flex justify-center items-center mt-4">
                                {/* Edit Button */}
                                <button
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors mr-2"
                                    onClick={() => navigate(`/admin/edit_fellowership/${item.id}`)}

                                >
                                    Edit
                                </button>

                                {/* Delete Button with Confirmation */}
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminFellowership;
