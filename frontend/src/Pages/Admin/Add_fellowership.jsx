import React, { useState, useEffect } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import { fellowshipService, authService, toFormData, getErrorMessage } from '../../api';

const AddFellowship = () => {
    const [formData, setFormData] = useState({ title: '', description: '', fellowership_image: null });
    const [message, setMessage] = useState('');

    // Prime Django's `csrftoken` cookie; the API client attaches the header itself.
    useEffect(() => {
        authService.fetchCsrfToken();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await fellowshipService.create(toFormData({
                title: formData.title,
                description: formData.description,
                fellowership_image: formData.fellowership_image,
            }));

            setMessage(data?.message || 'Fellowship added successfully.');
            setFormData({ title: '', description: '', fellowership_image: null });
        } catch (error) {
            setMessage(getErrorMessage(error, 'Error adding fellowship'));
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 md:ml-64 min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                    <header className="mb-4 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Add Fellowship</h1>
                    </header>

                    {message && <p className="text-green-600 text-center">{message}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-semibold">Fellowship Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold">Description:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold">Fellowship Image:</label>
                            <input
                                type="file"
                                name="fellowership_image"
                                onChange={handleFileChange}
                                className="w-full p-3 border rounded focus:outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-blue-700 text-white font-bold rounded hover:bg-blue-900 transition-all duration-200"
                        >
                            Add Fellowship
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddFellowship;
