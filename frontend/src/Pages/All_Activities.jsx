import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const All_Activities = () => {
  const [all_activities, setAllactivities] = useState([]);
  const [searchQuery,setSearchQuery]=useState("");

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/All_activities/')
      .then((response) => {
        setAllactivities(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredActivities = all_activities.filter((activity) => 
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchQuery.toLowerCase())
);


  return (
    <div className="min-h-screen bg-gray-100 pt-16 px-4 sm:px-6 lg:px-8">
      <header className="max-w-3xl mx-auto mb-8 mt-11">
        <form className="flex items-center ">
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            name="search"
            placeholder="Search activities"
            className="p-3 rounded-l-full border border-gray-300 focus:outline-none flex-grow"
          />
          <button
            type="submit"
            onClick={(e)=>e.preventDefault()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold p-3 rounded-r-full focus:outline-none"
          >
            Search
          </button>
        </form>
        <h1 className="text-3xl font-bold text-gray-800 p-7">All Redcross Activities</h1>
      </header>
        {filteredActivities.length >0 ?(
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
           <article>
           <img
              src={item.redcross_activities_image}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className='text-gray-600 text-right'>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p>
           </article>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2"><span className='text-dark font-semibold'>Title: </span>{item.title}</h2>
              <p className="text-gray-600 text-sm"><span className='text-dark font-semibold'>Short message: </span>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
        ):(
            <div>
                <h2 className="text-center text-gray-800 font-bold">No activities found "<strong>{searchQuery}</strong>"</h2>
            </div>
)}
    </div>
  );
};

export default All_Activities;
