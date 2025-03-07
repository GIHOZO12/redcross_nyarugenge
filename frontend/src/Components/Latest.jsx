// eslint-disable-next-line no-unused-vars
import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {formatDistanceToNow} from 'date-fns'

const Latest = () => {
  const [latest, setLatest] = React.useState([]);

  React.useEffect(() => {
    axios.get('https://gihozo.pythonanywhere.com/latest_fellowership/')
      .then(response => {
        // console.log("Fetched data:", response.data);  // Debugging
        setLatest(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Latest Fellowships</h1>
        <p className="text-gray-600 mt-2">Explore the newest Redcross fellowership</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latest.map((item, index) => (
          <motion.div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-shadow duration-300"
           initial={{opacity:0.2,y:100}}
           transition={{duration:2}}
           whileInView={{opacity:1,y:0}}
           viewport={{once:true}}
          >
            <article>
            <img 
              src={item.fellowership_image} 
              alt="fellowership_image" 
              className="w-full h-48 object-cover"
            />
            <p className='text-right text-gray-600'>{ formatDistanceToNow(new Date(item.created_at),{addSuffix:true}) } </p>
            </article>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Latest;
