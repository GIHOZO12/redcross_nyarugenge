import React from 'react';
import { Activities } from '../Felloweship/Activities';

const Humanity = () => {
  return (
    <div className="p-4">
      <h1 className="text-center text-xl sm:text-2xl font-bold pb-6">
        Humanity and Family Activities
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Activities.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg border transition-transform hover:scale-105"
          >
            <img
              src={item.image}
              alt="Image not found"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <div>
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Humanity;
