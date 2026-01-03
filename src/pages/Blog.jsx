import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: 'Building Progressive Web Apps with Angular',
      excerpt: 'Learn how to transform your Angular web apps into PWAs for amazing user experience with offline support and mobile features.',
      author: 'Sara Mehta',
      date: 'Apr 23, 2025',
      category: 'Web Development',
      image: 'https://via.placeholder.com/600x400/4285F4/ffffff?text=PWA+Angular',
      readTime: '8 min read'
    },
    {
      id: 2,
      title: 'Introduction to Firebase Authentication',
      excerpt: 'Set up user authentication in your web app using Firebase Authentication. Learn about social logins and secure user.',
      author: 'Utkarsh Tiwari',
      date: 'Sept 30, 2025',
      category: 'Cloud',
      image: 'https://via.placeholder.com/600x400/FBBC04/ffffff?text=Firebase+Auth',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'Creating Custom UI Components with Flutter',
      excerpt: 'Discover how to build reusable UI components in Flutter that perfectly align with Material Design and create rich apps.',
      author: 'Bhavika Patel',
      date: 'Apr 17, 2025',
      category: 'Mobile Development',
      image: 'https://via.placeholder.com/600x400/34A853/ffffff?text=Flutter+UI',
      readTime: '7 min read'
    },
    {
      id: 4,
      title: 'Google Cloud Functions: A Practical Guide',
      excerpt: 'Learn how to quickly deploy and manage serverless functions in Google Cloud Functions for your backend services.',
      author: 'Samir Ahsan',
      date: 'Nov 16, 2025',
      category: 'Cloud',
      image: 'https://via.placeholder.com/600x400/EA4335/ffffff?text=Cloud+Functions',
      readTime: '10 min read'
    },
    {
      id: 5,
      title: 'Optimizing Angular Applications for Performance',
      excerpt: 'Tips and techniques for improving the performance of Angular apps to ensure lightning-fast user interactions.',
      author: 'Suraj Narayan',
      date: 'March 3, 2025',
      category: 'Web Development',
      image: 'https://via.placeholder.com/600x400/4285F4/ffffff?text=Angular+Performance',
      readTime: '9 min read'
    },
    {
      id: 6,
      title: 'Introduction to Android Jetpack Compose',
      excerpt: 'Get started with modern UI toolkit for native Android. Learn the basics of composables and building beautiful UIs.',
      author: 'Udan Thaman',
      date: 'January 20, 2025',
      category: 'Mobile Development',
      image: 'https://via.placeholder.com/600x400/34A853/ffffff?text=Jetpack+Compose',
      readTime: '11 min read'
    }
  ];

  const categories = ['all', 'Web Development', 'Cloud', 'Mobile Development', 'Machine Learning', 'AI/ML', 'Design'];

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            GDGoC Blogs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Technical articles, tutorials, and insights from our community of developers
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories Sidebar */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-google-blue text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Latest Articles */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white dark:bg-gray-800 text-google-blue px-3 py-1 rounded-full text-xs font-bold">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-google-blue transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {post.date}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {post.readTime}
                    </span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-google-blue font-medium hover:underline"
                    >
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;