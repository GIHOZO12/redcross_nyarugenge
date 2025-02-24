import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import React Router for navigation

const Firstaidcourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/first-aid_course/")
      .then((response) => {
        console.log("API Response:", response.data);
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
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
    <div className="min-h-screen bg-gray-100 pt-16 px-6">
      <header className="max-w-3xl mx-auto mb-8 mt-11">
        <form className="flex items-center">
          <input
            type="search"
            name="search"
            placeholder="Search first-aid courses"
            className="p-3 rounded-l-full border border-gray-300 focus:outline-none flex-grow"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white font-bold p-3 rounded-r-full focus:outline-none"
            onClick={(e) => e.preventDefault()}
          >
            Search
          </button>
        </form>
        <h1 className="text-3xl font-bold text-gray-800 p-7">All First-aid Courses</h1>
      </header>

      <section className="flex justify-center mt-20 items-center">
        {filteredCourses.length >0 ?(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {item.first_image ? (
                <img
                  src={item.first_image}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <p className="p-4 text-gray-500">No image available</p>
              )}

              <div className="p-4">
                <h2 className="text-xl ">{item.title}</h2>
                <Link
                  to={`/course/first-aid-courses/${item.id}`} // ✅ Fixed the link
                  className="text-blue-500 hover:text-blue-700 p-9 m-6 cursor-pointer"
                >
                  See details
                </Link>
              </div>
            </div>
          ))}
        </div>
        ):(
            <p className="text-center text-gray-500">No courses found  "<strong>{searchQuery}</strong>"</p>
          )}
      </section>
    </div>
  );
};

export default Firstaidcourses;
