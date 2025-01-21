import React from 'react';
import { Fellowership } from '../Felloweship/Meeting';

const Latest = () => {
  return (
    <div className="p-4">
      <h1 className="text-center text-xl sm:text-2xl font-bold  pb-4 mb-6">
        Latest Fellowship
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Fellowership.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg border transition-transform hover:scale-105"
          >
            <img
              src={item.image}
              alt="Not found"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <div>
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm sm:text-base">{item.Description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Latest;
