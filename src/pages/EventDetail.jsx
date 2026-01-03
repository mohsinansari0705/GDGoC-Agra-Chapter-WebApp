import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowLeft, ExternalLink, Award, Target } from 'lucide-react';

const EventDetail = () => {
  const { eventId } = useParams();

  // Mock event data - In production, this would come from an API or state management
  const eventsDatabase = {
    'techsprint-2026': {
      title: 'TechSprint',
      tagline: 'HACKATHON',
      date: 'Jan 30, 2026',
      endDate: 'Feb 1, 2026',
      time: '9:00 AM onwards',
      location: 'SRM Campus, Agra',
      participants: '500+ Expected',
      status: 'Registrations Open',
      color: 'from-red-500 to-orange-500',
      description: 'An open-innovation hackathon where students developers get 36 hours to learn, collaborate, and compete in one of the most exciting student hackathon around. Organized by GDG on Campus SRM Institute of Science and Technology - Sharda University, Agra. Participate in full flow, take up real-life problems and use the latest and greatest technologies from Google, and other partners and get a chance to win from massive pool prizes, and learn like never before!',
      schedule: [
        {
          title: 'Registration and Team Formation',
          date: 'Dec 20, 2025 - Jan 25, 2026',
          time: 'Dec 25 12:00 PM',
          description: 'Register as a team or as individuals and let the organizers help you form a team of 2-4.',
          type: 'external'
        },
        {
          title: 'Project Submission',
          date: 'Dec 25, 2025 - Jan 25, 2026',
          time: 'Jan 26 10:00 PM',
          description: 'Email the submission guidelines and quickly log by the deadline',
          type: 'external'
        },
        {
          title: 'Initial Evaluation',
          date: 'Jan 26, 12:00 PM - Jan 27, 8:00 PM',
          time: 'External',
          description: 'Evaluation of the submissions on the judging parameters',
          type: 'external'
        },
        {
          title: 'Top 10 Announcement',
          date: 'Jan 28, 2026 - Jan 28, 6:00 PM',
          time: 'External',
          description: 'Initial 10 of the top 10 performing teams',
          type: 'external'
        },
        {
          title: 'Top 10 Teams Final Pitching',
          date: 'Jan 30, 2026 - Jan 30, 8:00 PM',
          time: 'External',
          description: 'Final showdown and evaluation of the top 3 projects',
          type: 'external'
        },
        {
          title: 'Final Announcement of Winners',
          date: 'Feb 1, 2026 - Feb 1, 8:00 PM',
          time: 'External',
          description: 'Final announcement of the top 3 teams',
          type: 'external'
        }
      ],
      prizes: [
        { position: '1st Place', amount: '₹50,000', icon: '🥇' },
        { position: '2nd Place', amount: '₹30,000', icon: '🥈' },
        { position: '3rd Place', amount: '₹20,000', icon: '🥉' }
      ],
      themes: [
        'Healthcare & Wellness',
        'Education Technology',
        'Sustainable Development',
        'Fintech Innovation',
        'Smart Cities',
        'Open Innovation'
      ]
    },
    'vividglyph-2025': {
      title: 'VividGlyph',
      tagline: 'HACKATHON',
      date: 'Sep 15, 2025',
      time: '11:00 AM',
      location: 'SRM Campus, Agra',
      participants: '450+ Participated',
      status: 'Completed',
      color: 'from-blue-500 to-cyan-500',
      description: 'VividGlyph is a 24-hour long, one-of-a-kind Inter college Designathon. Open to all design aficionados to put problem-solving skills to the test and use design to solve real-world problems.',
      schedule: [
        {
          title: 'Registration Opens',
          date: 'Aug 20, 2025',
          time: '10:00 AM',
          description: 'Registration portal opens for all participants',
          type: 'external'
        },
        {
          title: 'Design Challenge Begins',
          date: 'Sep 15, 2025',
          time: '11:00 AM',
          description: 'Participants receive the design challenge',
          type: 'external'
        },
        {
          title: 'Mid-Event Checkpoint',
          date: 'Sep 15, 2025',
          time: '11:00 PM',
          description: 'Teams present their progress to mentors',
          type: 'external'
        },
        {
          title: 'Final Submissions',
          date: 'Sep 16, 2025',
          time: '11:00 AM',
          description: 'Teams submit their final designs',
          type: 'external'
        }
      ],
      prizes: [
        { position: '1st Place', amount: '₹25,000', icon: '🥇' },
        { position: '2nd Place', amount: '₹15,000', icon: '🥈' },
        { position: '3rd Place', amount: '₹10,000', icon: '🥉' }
      ]
    }
  };

  const event = eventsDatabase[eventId] || eventsDatabase['techsprint-2026'];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br ${event.color} py-20 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <Link
            to="/events"
            className="inline-flex items-center text-white mb-6 hover:underline"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Events
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold">
                {event.tagline}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 mr-2" />
                <div>
                  <p className="text-sm opacity-80">Date</p>
                  <p className="font-semibold">{event.date}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-2" />
                <div>
                  <p className="text-sm opacity-80">Time</p>
                  <p className="font-semibold">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-2" />
                <div>
                  <p className="text-sm opacity-80">Location</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="w-6 h-6 mr-2" />
                <div>
                  <p className="text-sm opacity-80">Participants</p>
                  <p className="font-semibold">{event.participants}</p>
                </div>
              </div>
            </div>

            {event.status === 'Registrations Open' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:shadow-xl transition-shadow duration-200"
              >
                Register Now
                <ExternalLink className="ml-2 w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                About This Event
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {event.description}
              </p>
            </motion.section>

            {/* Event Schedule */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Event Schedule
              </h2>
              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-l-4 border-google-blue"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-google-blue px-3 py-1 rounded-full text-sm font-medium">
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {item.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <Clock className="w-4 h-4 mr-2" />
                      {item.time}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Themes (if available) */}
            {event.themes && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Problem Statements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.themes.map((theme, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-blue-200 dark:border-gray-600"
                    >
                      <div className="flex items-center">
                        <Target className="w-5 h-5 text-google-blue mr-3" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {theme}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Prizes */}
            {event.prizes && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 text-google-yellow mr-2" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Prizes
                  </h3>
                </div>
                <div className="space-y-4">
                  {event.prizes.map((prize, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-3xl mr-3">{prize.icon}</span>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {prize.position}
                            </p>
                            <p className="text-2xl font-bold text-google-green">
                              {prize.amount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Share Event */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Share This Event
              </h3>
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  LinkedIn
                </button>
                <button className="flex-1 bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  Twitter
                </button>
              </div>
            </motion.div>

            {/* Related Events */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Related Events
              </h3>
              <div className="space-y-3">
                <Link
                  to="/events/vividglyph-2025"
                  className="block p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">VividGlyph</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sep 15, 2025</p>
                </Link>
                <Link
                  to="/events/google-cloud-study-jams"
                  className="block p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">Google Cloud Study Jams</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Oct 1, 2025</p>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
