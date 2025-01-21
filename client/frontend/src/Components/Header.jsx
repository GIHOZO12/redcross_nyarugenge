import React from 'react';
import Image from '../assets/Myimage.jpg';

const Header = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <img
        src={Image}
        alt="Background"
        className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] object-cover"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 px-4">
        <h1 className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">
          Welcome to RRC Nyarugenge C. Youths
        </h1>
        <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl text-center max-w-3xl">
          We are a powered family committed and passionate about humanitarian activities.
        </p>
      </div>
    </div>
  );
};

export default Header;
