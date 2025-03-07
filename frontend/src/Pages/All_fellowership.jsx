import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const AllFellowship = () => {
  const [allFellowship, setAllFellowship] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('https://gihozo.pythonanywhere.com/all_fellowships/')
      .then((response) => {
        setAllFellowship(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredFellowships = allFellowship.filter((fellowship) =>
    fellowship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fellowship.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-16 px-4 sm:px-6 lg:px-8">
      <header className="max-w-3xl mx-auto mb-8 mt-11">
        <form className="flex items-center">
          <input
            type="search"
            name="search"
            placeholder="Search fellowship"
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
        <h1 className="text-3xl font-bold text-gray-800 p-7">All Family Fellowships</h1>
      </header>

      {filteredFellowships.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFellowships.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
             <article>
             <img
                src={item.fellowship_image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className='text-right text-gray-600'>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p>
             </article>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-gray-600">No results found for "<strong>{searchQuery}</strong>".</p>
        </div>
      )}
    </div>
  );
};

export default AllFellowship;
