// eslint-disable-next-line no-unused-vars
import React from 'react';
import Image from '../assets/Myimage.jpg';

const Header = () => {
  return (
    <div className="relative mt-9">
      <img
        src={Image}
        alt="Background"
        className="w-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-6 sm:p-10">
        <h1 className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-center leading-tight">
          Welcome to RRC Nyarugenge C. Youths
        </h1>
        <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl text-center max-w-3xl leading-relaxed">
          We are a powered family committed and passionate about humanitarian activities.
        </p>
      </div>
    </div>
  );
};

export default Header;
