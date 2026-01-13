import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, BookOpen, Code2, Sparkles, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer, pageTransition, scaleIn, hoverScale } from '../utils/animations';
import { supabase } from '../lib/supabaseClient';

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!supabase) return;
      
      try {
        // First try to get upcoming and live events
        let { data, error } = await supabase
          .from('events')
          .select('id,title,date,category,status,color,cover_image_url,slug,featured')
          .in('status', ['upcoming', 'live'])
          .order('featured', { ascending: false })
          .order('date', { ascending: true })
          .limit(3);

        // If no upcoming/live events, get completed events as fallback
        if (!error && (!data || data.length === 0)) {
          const result = await supabase
            .from('events')
            .select('id,title,date,category,status,color,cover_image_url,slug,featured')
            .eq('status', 'completed')
            .order('featured', { ascending: false })
            .order('date', { ascending: false })
            .limit(3);
          
          data = result.data;
          error = result.error;
        }

        if (error) throw error;

        const mapped = (data || []).map(event => {
          const statusRaw = String(event.status || '').trim().toLowerCase();
          let normalizedStatus = statusRaw; // Use the status from DB directly

          return {
            id: event.id,
            slug: event.slug || event.id,
            title: event.title || '',
            date: event.date || '',
            category: event.category || 'Event',
            color: event.color || 'from-blue-500 to-cyan-500',
            status: normalizedStatus,
            image: String(event.cover_image_url || '').trim(),
            featured: event.featured || false,
          };
        });

        setEvents(mapped);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  const techAreas = [
    {
      title: 'Web Development',
      description: 'HTML5, React.js, Next.js, modern web tech',
      color: 'bg-red-500',
      icon: <Code2 className="w-8 h-8" />
    },
    {
      title: 'AI/ML',
      description: 'Artificial Intelligence, ML models',
      color: 'bg-green-500',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      title: 'Android',
      description: 'React Native and Flutter',
      color: 'bg-blue-500',
      icon: <Code2 className="w-8 h-8" />
    },
    {
      title: 'Design & Photography',
      description: 'UI/UX design and photography',
      color: 'bg-yellow-500',
      icon: <BookOpen className="w-8 h-8" />
    }
  ];

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative"
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-br from-blue-50/50 via-white to-yellow-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 z-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-google-blue/10 to-transparent rounded-full blur-3xl opacity-30 dark:opacity-10" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -60, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-google-yellow/10 to-transparent rounded-full blur-3xl opacity-30 dark:opacity-10" 
          />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700 shadow-sm mb-6"
              >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-google-green"></span>
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Join Agra's Largest Tech Community
                  </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Welcome to{' '}
                <span className="text-gradient from-google-blue via-google-red to-google-yellow">
                  GDG on Campus
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                Sharda University Agra
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-8"
              >
                Connect with the community, learn from experts, and explore your passion for technology. Join us on our journey of learning, growth, and collaboration.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/events"
                  className="inline-flex items-center px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                >
                  Explore Events
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a
                  href="https://gdg.community.dev/gdg-on-campus-sharda-university-agra-india/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-bold"
                >
                  Join Community
                </a>
              </motion.div>
            </motion.div>

            {/* Right Content - Animated Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 flex items-center justify-center">
                {/* Animated circles */}
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-0 left-1/4 w-20 h-20 bg-google-blue rounded-full opacity-20"></div>
                  <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-google-red rounded-full opacity-20"></div>
                  <div className="absolute top-1/4 right-0 w-24 h-24 bg-google-yellow rounded-full opacity-20"></div>
                  <div className="absolute bottom-1/4 left-0 w-20 h-20 bg-google-green rounded-full opacity-20"></div>
                </motion.div>

                {/* Center Logo Animation */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      d="M40 40L80 100L40 160H70L110 100L70 40H40Z"
                      fill="#4285F4"
                    />
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.7 }}
                      d="M110 40L150 100L110 160H140L180 100L140 40H110Z"
                      fill="#EA4335"
                    />
                    <motion.circle
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                      cx="80"
                      cy="100"
                      r="15"
                      fill="#FBBC04"
                    />
                    <motion.circle
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.4 }}
                      cx="150"
                      cy="100"
                      r="15"
                      fill="#34A853"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* Explore Our Events */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Explore Our <span className="text-google-blue">Events</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From hackathons to hands-on workshops, we host events that ignite innovation and foster collaboration.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          >
            {events.map((event, index) => (
              <Link
                key={event.id}
                to={`/events/${event.slug}`}
              >
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -12, transition: { duration: 0.3 } }}
                  className="relative overflow-hidden rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 cursor-pointer group h-full"
                >
                {/* Image Section with Better Overlay */}
                <div className="h-64 relative overflow-hidden">
                  {event.image ? (
                    <>
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                    </>
                  ) : (
                    <div className={`flex absolute inset-0 bg-gradient-to-br ${event.color} p-6 flex-col justify-end`}>
                       <motion.div 
                         initial={{ rotate: 0 }}
                         whileHover={{ rotate: 10, scale: 1.1 }}
                         className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4"
                       >
                            <Calendar size={80} className="text-white" />
                       </motion.div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`text-xs font-bold backdrop-blur-md px-4 py-2 rounded-full border shadow-lg ${
                      event.status === 'upcoming' 
                        ? 'bg-blue-500/95 border-blue-400/50 text-white'
                        : event.status === 'live' 
                        ? 'bg-green-500/95 border-green-400/50 text-white animate-pulse' 
                        : 'bg-gray-500/95 border-gray-400/50 text-white'
                    }`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-xs font-bold bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-white/30">
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="bg-white dark:bg-gray-800 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-google-blue transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-google-blue" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-semibold text-google-blue group-hover:underline">
                      View Details
                    </span>
                    <ArrowRight className="w-5 h-5 text-google-blue transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Animated Bottom Border */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${event.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
              </motion.div>
              </Link>
            ))}
          </motion.div>

          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                About Us
              </h2>
              <h3 className="text-2xl font-semibold text-google-blue mb-4">
                Empowering students to innovate and create impactful solutions through technology
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  GDG On Campus Sharda University Agra is a vibrant community of students who are passionate about exploring and learning cutting-edge technologies to build their careers.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-google-blue mr-2">📍</span>
                    <span><strong>Behind Wardha:</strong> Sharda University Agra</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-google-green mr-2">👥</span>
                    <span><strong>1000+ Members:</strong> All over</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-google-red mr-2">🎯</span>
                    <span><strong>Mission:</strong> Giving exposure and opportunities to students through technology and innovation</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-google-blue">
                     <Users className="w-6 h-6" />
                </div>
                <h4 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">500+</h4>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Members</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                 <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-google-red">
                     <Calendar className="w-6 h-6" />
                </div>
                <h4 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">10+</h4>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Events</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                 <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-google-yellow">
                     <Code2 className="w-6 h-6" />
                </div>
                <h4 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">5+</h4>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Workshops</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                 <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-google-green">
                     <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">2+</h4>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hackathons</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Focus Areas */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technology Focus Areas
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {techAreas.map((area, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -15 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-google-blue to-google-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className={`${area.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-google-blue transition-colors">
                  {area.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
