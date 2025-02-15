// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import axios from 'axios';

const Admin_courses = () => {
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/admin_courses/")
            .then((response) => {
                setCourses(response.data);
            })
            .catch((error) => {
                console.error("Error fetching courses", error);
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className='p-6 md:ml-64 min-h-screen bg-gray-100'>
                <header className='max-w-5xl mx-auto mt-7'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                        {/* Search Bar */}
                        <form className='flex items-center w-full md:w-auto'>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className='p-3 rounded-l-full border border-gray-300 focus:outline-none w-full md:w-72'
                            />
                            <button
                                type="submit"
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 rounded-r-full focus:outline-none'
                            >
                                Search
                            </button>
                        </form>
                        {/* Add Course Button */}
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded focus:outline-none'>
                            Add New Course
                        </button>
                    </div>
                </header>

                {/* Course Listing */}
                <section className='max-w-5xl mx-auto my-8'>
                    <h2 className='text-2xl font-bold text-center p-4'>
                        All Courses Offered by Nyarugenge Red Cross
                    </h2>

                    {filteredCourses.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {filteredCourses.map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                                    <img
                                        src={item.first_image}
                                        alt={item.title}
                                        className='w-full h-48 object-cover rounded-lg'
                                    />
                                    <div className="mt-2">
                                        <h2 className="text-lg font-semibold">
                                            <span className='text-gray-700 font-bold'>Title:</span> {item.title}
                                        </h2>
                                        <h2 className="text-gray-700">
                                            <span className='font-bold'>Instructor:</span> {item.instructor.name}
                                        </h2>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center p-4'>
                            <h2>No courses found for "<strong>{searchQuery}</strong>"</h2>
                        </div>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
};

export default Admin_courses;
