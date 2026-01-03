import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
  const [filter, setFilter] = useState('all');

  const eventsData = [
    {
      id: 'techsprint-2026',
      title: 'TechSprint',
      date: 'Jan 30, 2026',
      endDate: 'Feb 1, 2026',
      time: '9:00 AM',
      location: 'SRM Campus, Agra',
      category: 'Hackathon',
      status: 'upcoming',
      participants: '500+',
      description: 'An open-innovation hackathon where students developers get 36 hours to learn, collaborate, and compete in one of the most exciting student hackathon around.',
      image: 'https://via.placeholder.com/600x400/EA4335/ffffff?text=TechSprint',
      color: 'from-red-500 to-orange-500',
      registrationLink: '#'
    },
    {
      id: 'promptrush-2025',
      title: 'PromptRush 2.0',
      date: 'Sep 12, 2025',
      time: '10:00 AM',
      location: 'Online',
      category: 'Workshop',
      status: 'past',
      participants: '300+',
      description: 'Unlock the power of innovation with Google AI and Cloud. Designed for budding AI engineers including Data Engineers.',
      image: 'https://via.placeholder.com/600x400/FBBC04/ffffff?text=PromptRush',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'vividglyph-2025',
      title: 'VividGlyph',
      date: 'Sep 15, 2025',
      time: '11:00 AM',
      location: 'SRM Campus, Agra',
      category: 'Hackathon',
      status: 'past',
      participants: '450+',
      description: 'VividGlyph is a 24-hour long, one-of-a-kind Inter college Designathon. Open to all design aficionados to put problem-solving skills to the test.',
      image: 'https://via.placeholder.com/600x400/4285F4/ffffff?text=VividGlyph',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'google-cloud-study-jams',
      title: 'Google Cloud Study Jams',
      date: 'Oct 1, 2025',
      time: '2:00 PM',
      location: 'Online',
      category: 'Workshop',
      status: 'past',
      participants: '600+',
      description: 'A cohort of learning Google Cloud Platform built for beginners with weekly learning sessions and resources from Google.',
      image: 'https://via.placeholder.com/600x400/34A853/ffffff?text=Study+Jams',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'cyberverse-2024',
      title: 'CyberVerse',
      date: 'Apr 20, 2025',
      time: '9:00 AM',
      location: 'SRM Campus, Agra',
      category: 'Hackathon',
      status: 'past',
      participants: '400+',
      description: 'CyberVerse brings together budding tech enthusiasts to collaborate on real-world cyber security challenges.',
      image: 'https://via.placeholder.com/600x400/9C27B0/ffffff?text=CyberVerse',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'autocoder-2024',
      title: 'AutoCoder 2.0',
      date: 'Feb 10, 2025',
      time: '3:00 PM',
      location: 'Online',
      category: 'Coding Competition',
      status: 'past',
      participants: '350+',
      description: 'The Digital Harvesting Challenge! Put your creativity and technology skills to the test.',
      image: 'https://via.placeholder.com/600x400/FF5722/ffffff?text=AutoCoder',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const categories = ['all', 'Hackathon', 'Workshop', 'Coding Competition'];

  const filteredEvents = filter === 'all' 
    ? eventsData 
    : eventsData.filter(event => event.category === filter);

  const upcomingEvents = filteredEvents.filter(e => e.status === 'upcoming');
  const pastEvents = filteredEvents.filter(e => e.status === 'past');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Events & Meetups
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Join our community events to learn, connect, and grow with fellow developers
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                filter === category
                  ? 'bg-google-blue text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer"
                >
                  <div className={`h-48 bg-gradient-to-br ${event.color} p-6 flex items-end relative overflow-hidden`}>
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Upcoming
                      </span>
                    </div>
                    <div className="text-white z-10">
                      <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-google-blue transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-google-blue" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2 text-google-red" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2 text-google-green" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2 text-google-yellow" />
                        {event.participants} Expected
                      </div>
                    </div>
                    
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-flex items-center text-google-blue font-medium hover:underline"
                    >
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer"
                >
                  <div className={`h-48 bg-gradient-to-br ${event.color} p-6 flex items-end relative overflow-hidden`}>
                    <div className="absolute top-4 right-4">
                      <span className="bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Completed
                      </span>
                    </div>
                    <div className="text-white z-10">
                      <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-google-blue transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-google-blue" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2 text-google-green" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2 text-google-yellow" />
                        {event.participants} Participated
                      </div>
                    </div>
                    
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-flex items-center text-google-blue font-medium hover:underline"
                    >
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
