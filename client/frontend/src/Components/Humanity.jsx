// eslint-disable-next-line no-unused-vars
import React, { useEffect,useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

import axios from 'axios';

const Humanity = () => {
 const [activities,setActivities]=useState([]);

 useEffect(() => {
  axios.get("http://127.0.0.1:8000/latest_redcross_activities/")
  .then((respoaonse) => {
    setActivities(respoaonse.data);
    console.log(respoaonse.data);
    })
    .catch((error) => {
      console.error('error fetching latest activities',error);
     });
 }, []);

  


  return (
    <div className="p-4">
      <h1 className="text-center text-xl sm:text-2xl font-bold pb-6">
        Humanity and Family Activities
      </h1>
      <p className="text-gray-600 mt-2 text-center">Explore the newest Redcross activities and events</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activities.map((item, index) => (
          <motion.div
          initial={{opacity:0.2,y:100}}
          transition={{duration:2}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg border transition-transform hover:scale-105"
          >
            <article>
            <img
              src={item.redcross_activities_image}
              alt="Image not found"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className='text-right text-gray-600'>{ formatDistanceToNow(new Date(item.created_at),{addSuffix:true}) }</p>
            </article>
            <div>
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Humanity;
