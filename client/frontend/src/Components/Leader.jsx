// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useTransition, animated } from '@react-spring/web';
import { Leader_info } from '../Felloweship/Leaders';

const Leader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const leadersPerPage = 3; // Number of leaders to display at once

  // Handle next button click (move to the next set of leaders)
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex + leadersPerPage >= Leader_info.length) {
        return 0; // If at the end, wrap around to the beginning
      }
      return prevIndex + leadersPerPage;
    });
  };

  // Handle previous button click (move to the previous set of leaders)
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex - leadersPerPage < 0) {
        return Leader_info.length - leadersPerPage; // If at the start, wrap around to the end
      }
      return prevIndex - leadersPerPage;
    });
  };

  // Calculate which leaders to display based on the current index
  const displayedLeaders = Leader_info.slice(
    currentIndex,
    currentIndex + leadersPerPage
  );

  // Using react-spring for transitions
  const transitions = useTransition(displayedLeaders, {
    from: { opacity: 0, transform: 'translateX(100%)' }, // Slide in from the right
    enter: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: 'translateX(-100%)' }, // Slide out to the left
    config: { duration: 500 },
  });

  return (
    <div className="relative">
      {/* Header */}
      <h1 className="text-center font-bold text-2xl p-4">Our Leaders</h1>

      {/* Navigation Buttons (Top-Right Corner) */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={handlePrev}
          className="p-3 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNext}
          className="p-3 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Display Leaders with Transition Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-7">
        {transitions((style, leader) => (
          <animated.div style={style} className="text-center bg-white shadow-md rounded-lg p-4">
            <img
              src={leader.image}
              className="rounded-full w-[150px] h-[150px]"
              alt={leader.name}
            />
            <h1 className="mt-2 font-bold">{leader.name}</h1>
            <h2 className="text-gray-700">{leader.period}</h2>
          </animated.div>
        ))}
      </div>
    </div>
  );
};

export default Leader;
