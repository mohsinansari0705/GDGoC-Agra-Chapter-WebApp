import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter } from 'lucide-react';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const events = [
    { id: 1, title: 'TechSprint', category: 'Hackathon', date: 'Jan 2026', image: 'https://via.placeholder.com/400x300/EA4335/ffffff?text=TechSprint', status: 'Upcoming' },
    { id: 2, title: 'Google Cloud Study Jams', category: 'Workshop', date: 'Oct 2025', image: 'https://via.placeholder.com/400x300/FBBC04/ffffff?text=Study+Jams', status: 'Completed' },
    { id: 3, title: 'VividGlyph', category: 'Hackathon', date: 'Sep 2025', image: 'https://via.placeholder.com/400x300/4285F4/ffffff?text=VividGlyph', status: 'Completed' },
    { id: 4, title: 'PromptRush 2.0', category: 'Workshop', date: 'Sep 2025', image: 'https://via.placeholder.com/400x300/FBBC04/ffffff?text=PromptRush', status: 'Completed' },
    { id: 5, title: 'CyberVerse', category: 'Hackathon', date: 'Apr 2025', image: 'https://via.placeholder.com/400x300/9C27B0/ffffff?text=CyberVerse', status: 'Completed' },
    { id: 6, title: 'AutoCoder 2.0', category: 'Coding', date: 'Feb 2025', image: 'https://via.placeholder.com/400x300/FF5722/ffffff?text=AutoCoder', status: 'Completed' },
    { id: 7, title: 'AutoCoder BuildOff', category: 'Coding', date: 'Jan 2025', image: 'https://via.placeholder.com/400x300/FF9800/ffffff?text=BuildOff', status: 'Completed' },
    { id: 8, title: 'Hack The Flag', category: 'Hackathon', date: 'Aug 2024', image: 'https://via.placeholder.com/400x300/F44336/ffffff?text=Hack+Flag', status: 'Completed' },
    { id: 9, title: 'Debugging Showdown', category: 'Workshop', date: 'Feb 2025', image: 'https://via.placeholder.com/400x300/E91E63/ffffff?text=Debugging', status: 'Completed' },
    { id: 10, title: 'AutoCoder Workshop', category: 'Workshop', date: 'Apr 2025', image: 'https://via.placeholder.com/400x300/3F51B5/ffffff?text=Workshop', status: 'Completed' },
    { id: 11, title: 'HackShop', category: 'Hackathon', date: 'Nov 2024', image: 'https://via.placeholder.com/400x300/2196F3/ffffff?text=HackShop', status: 'Completed' }
  ];

  const categories = ['all', 'Hackathon', 'Workshop', 'Coding'];

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Event Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Explore photos and videos from our past events and community gatherings
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Event Timeline Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Event Timeline</h2>
          <p className="text-gray-600 dark:text-gray-400">A chronological journey through our community events</p>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-google-blue text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      event.status === 'Upcoming' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-google-blue px-3 py-1 rounded-full text-xs font-medium">
                      {event.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
