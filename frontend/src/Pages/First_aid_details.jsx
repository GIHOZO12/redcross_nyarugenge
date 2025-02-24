import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ Get ID from URL
import axios from "axios";

const FirstAidDetails = () => {
  const { id } = useParams(); // ✅ Extract the course ID from URL
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/first-aid_course/${id}/`) // ✅ Fixed API URL
      .then((response) => {
        setCourseDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
      });
  }, [id]);

  if (!courseDetails) return <p className="text-center text-xl font-semibold text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6">
      <div className="max-w-7xl mx-auto bg-white p-8 shadow-xl rounded-lg">
        {/* Flex container to hold the video and instructor info */}
        <div className="flex flex-col lg:flex-row justify-between mb-8">
          {/* Course Video Section */}
          <section className="w-full lg:w-2/3 mb-6 lg:mb-0">
            {courseDetails.first_video ? (
              <video width="100%" height="auto" controls  className="rounded-lg shadow-md"  >
               <source src={courseDetails.first_video} type="video/mp4" />


              </video>
            ) : (
              <p className="text-center text-xl text-gray-500">No video available</p>
            )}
          </section>

          {/* Instructor Info Section */}
          <div className="w-full lg:w-1/3 flex flex-col items-start lg:items-center justify-between lg:pl-8">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructor Information</h2>
              {/* Instructor Image */}
              <img
                src={courseDetails.instructor?.instructor_image}
                alt={courseDetails.instructor?.name}
                className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
              />
              {/* Instructor Details */}
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{courseDetails.instructor?.name}</h3>
                <p className="text-lg text-gray-700 mb-2">
                  <span className="font-bold text-gray-800">Email:</span> {courseDetails.instructor?.email}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-bold text-gray-800">Phone:</span> {courseDetails.instructor?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Title and Description Section below the video */}
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{courseDetails.title}</h1>
          <p className="text-lg text-gray-700">{courseDetails.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FirstAidDetails;
