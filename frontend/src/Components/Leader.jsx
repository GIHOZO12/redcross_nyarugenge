// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import axios from 'axios';

const Leader = () => {
  const [leader, setLeader] = useState([]);

  useEffect(() => {
    axios.get("https://gihozo.pythonanywhere.com/leaders")
      .then((response) => {
        setLeader(response.data);
      })
      .catch((error) => {
        console.error("Error fetching leaders", error);
      });
  }, []);

  return (
    <div className="relative bg-gray-100 p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-center text-2xl sm:text-3xl font-bold mb-8">Our Leaders</h1>

      {/* Navigation Buttons */}
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        <button id="prev-btn" className="p-3 bg-gray-300 rounded-full hover:bg-gray-400 shadow-lg">
          <FaArrowLeft />
        </button>
        <button id="next-btn" className="p-3 bg-gray-300 rounded-full hover:bg-gray-400 shadow-lg">
          <FaArrowRight />
        </button>
      </div>

      {/* Swiper Component */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1} // Default for mobile
        centeredSlides={true} // Center slides for small screens
        grabCursor={true} // Easier scrolling on touch devices
        breakpoints={{
          480: { slidesPerView: 1 },  // Extra Small devices (e.g., older iPhones)
          640: { slidesPerView: 1 },  // Small devices (phones)
          768: { slidesPerView: 2 },  // Tablets
          1024: { slidesPerView: 3 }, // Laptops (keep 3)
          1280: { slidesPerView: 3 }, // Large Screens (keep 3)
        }}
        navigation={{
          prevEl: '#prev-btn',
          nextEl: '#next-btn',
        }}
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {leader.map((leader, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white text-center shadow-md rounded-lg p-4 sm:p-6">
              <img
                src={leader.leader_image}
                alt={leader.first_name}
                className="rounded-full w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-4"
              />
              <h2 className="text-base sm:text-xl font-semibold">{leader.first_name} {leader.last_name}</h2>
              <p className="text-gray-600 text-xs sm:text-base">
                {new Date(leader.start_date).getFullYear()} - {new Date(leader.end_year).getFullYear()}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Leader;
