import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const formatExactTimeDifference = (dateString) => {
  const pastDate = new Date(dateString + 'Z'); // Force UTC
  const now = new Date();

  const seconds = Math.floor((now - pastDate) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years !== 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months !== 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  return "just now";
};

const Latest = () => {
  const [latest, setLatest] = React.useState([]);

  React.useEffect(() => {
    axios.get('https://gihozo.pythonanywhere.com/latest_fellowership/')
      .then(response => setLatest(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Latest Fellowships</h1>
        <p className="text-gray-600 mt-2">Explore the newest Redcross fellowership</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latest.map((item, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-shadow duration-300"
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 2 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <article>
              <img 
                src={item.fellowership_image} 
                alt="fellowership_image" 
                className="w-full h-48 object-cover"
              />
              <p className='text-right text-gray-600 pr-2 pt-1'>
                {formatExactTimeDifference(item.created_at)}
              </p>
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