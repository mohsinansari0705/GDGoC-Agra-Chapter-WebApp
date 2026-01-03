import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Calendar, Users as UsersIcon, BookOpen, Image, LogIn } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Demo: username=admin, password=admin123');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-google-blue rounded-full mb-4">
              <Lock className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to manage GDGoC content
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-google-blue"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-google-blue"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-google-blue text-white py-3 rounded-lg font-bold hover:bg-blue-600 flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Demo Credentials:</strong><br />
              Username: admin<br />
              Password: admin123
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
              <Calendar className="w-12 h-12 text-google-blue" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Members</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
              </div>
              <UsersIcon className="w-12 h-12 text-google-red" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Blog Posts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">18</p>
              </div>
              <BookOpen className="w-12 h-12 text-google-yellow" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Gallery Items</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">156</p>
              </div>
              <Image className="w-12 h-12 text-google-green" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-google-blue rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 font-medium">
                + Add New Event
              </button>
              <button className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-900/20 text-google-red rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 font-medium">
                + Create Blog Post
              </button>
              <button className="w-full text-left px-4 py-3 bg-green-50 dark:bg-green-900/20 text-google-green rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 font-medium">
                + Upload to Gallery
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">New event created: TechSprint 2026</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">Blog post published</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">5 hours ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-google-blue to-google-green p-8 rounded-2xl text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-2">Full Admin Panel Coming Soon!</h3>
          <p className="text-lg">
            Complete CRUD operations for events, blog posts, members, and gallery will be available in the next update.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
