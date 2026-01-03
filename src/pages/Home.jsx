import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, BookOpen, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const events = [
    {
      id: 1,
      title: 'TechSprint',
      date: 'Jan 30, 2026',
      category: 'Hackathon',
      color: 'from-red-500 to-orange-500',
      status: 'Upcoming'
    },
    {
      id: 2,
      title: 'Google Cloud Study Jams',
      date: 'Oct 1, 2025',
      category: 'Workshop',
      color: 'from-yellow-500 to-amber-500',
      status: 'Completed'
    },
    {
      id: 3,
      title: 'VividGlyph',
      date: 'Sep 15, 2025',
      category: 'Hackathon',
      color: 'from-blue-500 to-cyan-500',
      status: 'Completed'
    }
  ];

  const techAreas = [
    {
      title: 'Web Development',
      description: 'HTML5, React.js, Next.js, modern web tech',
      color: 'bg-blue-500',
      icon: <Code2 className="w-8 h-8" />
    },
    {
      title: 'AI/ML',
      description: 'Artificial Intelligence, ML models',
      color: 'bg-red-500',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      title: 'Android',
      description: 'React Native and Flutter',
      color: 'bg-yellow-500',
      icon: <Code2 className="w-8 h-8" />
    },
    {
      title: 'Design & Photography',
      description: 'UI/UX design and photography',
      color: 'bg-green-500',
      icon: <BookOpen className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
                className="inline-block mb-4"
              >
                <span className="bg-blue-100 dark:bg-blue-900/30 text-google-blue px-4 py-2 rounded-full text-sm font-medium">
                  Google Developer Group on Campus
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
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 border-2 border-google-blue text-google-blue rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 font-medium"
                >
                  Join Community
                </Link>
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

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-google-blue rounded-full filter blur-3xl opacity-10 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-google-yellow rounded-full filter blur-3xl opacity-10 -z-10"></div>
      </section>

      {/* Explore Our Events */}
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
              Explore Our Events
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Connect with the community, learn from experts, and explore your knowledge
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group"
              >
                <div className={`h-48 bg-gradient-to-br ${event.color} p-6 flex items-end`}>
                  <div className="text-white">
                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {event.category}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  <button className="mt-4 text-google-blue font-medium hover:underline">
                    View Details →
                  </button>
                </div>
              </motion.div>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
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
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-center"
              >
                <Users className="w-12 h-12 text-google-blue mx-auto mb-4" />
                <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">500+</h4>
                <p className="text-gray-600 dark:text-gray-400">Members</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-center"
              >
                <Calendar className="w-12 h-12 text-google-red mx-auto mb-4" />
                <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10+</h4>
                <p className="text-gray-600 dark:text-gray-400">Events</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-center"
              >
                <Code2 className="w-12 h-12 text-google-yellow mx-auto mb-4" />
                <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">5+</h4>
                <p className="text-gray-600 dark:text-gray-400">Workshops</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-center"
              >
                <BookOpen className="w-12 h-12 text-google-green mx-auto mb-4" />
                <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">2+</h4>
                <p className="text-gray-600 dark:text-gray-400">Hackathons</p>
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
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-transparent hover:border-google-blue transition-all duration-300"
              >
                <div className={`${area.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4`}>
                  {area.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {area.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
