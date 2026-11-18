import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { activitiesService } from '../api';
import { useFetch } from '../hooks';

const formatExactTimeDifference = (dateString) => {
  // Parse the date string as UTC (force timezone consistency)
  const pastDate = new Date(dateString + 'Z'); // Append 'Z' for UTC
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
  return "just now"; // For times < 1 minute
};

const Humanity = () => {
  const { data: activities } = useFetch(activitiesService.latest, [], []);

  return (
    <div className="p-4">
      <h1 className="text-center text-xl sm:text-2xl font-bold pb-6">
        Humanity and Family Activities 
      </h1>
      <p className="text-gray-600 mt-2 text-center">Explore the newest Redcross activities and events</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activities.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 2 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-4 rounded-lg shadow-lg border transition-transform hover:scale-105"
          >
            <article>
              <img
                src={item.redcross_activities_image}
                alt="Red Cross Activity"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-right text-gray-600">
                {formatExactTimeDifference(item.created_at)}
              </p>
            </article>
            <div>
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              {/* clamped on the card; the full text lives on the detail page */}
              <p className="text-gray-600 text-sm sm:text-base line-clamp-3">{item.description}</p>
              <Link
                to={`/activity/${item.id}`}
                className="inline-block mt-3 text-sm font-semibold text-red-600 hover:text-red-800"
              >
                View details &rarr;
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Humanity;