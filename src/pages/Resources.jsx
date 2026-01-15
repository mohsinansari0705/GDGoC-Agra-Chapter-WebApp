import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Search, BookOpen, Heart, Eye, Star
} from 'lucide-react';
import { pageTransition } from '../utils/animations';

const categories = [
  'All',
  'Tutorial',
  'Documentation',
  'Tool',
  'Article',
  'Video',
  'Course',
  'Book',
  'Template',
  'Other'
];

export default function Resources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, selectedCategory, searchQuery]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_resources_with_admin');

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredResources(filtered);
  };

  const handleResourceClick = (resource) => {
    navigate(`/resources/${resource.slug}`);
  };

  const handleLike = async (e, resourceId) => {
    e.stopPropagation();

    try {
      const { data, error } = await supabase.rpc('increment_resource_like', {
        p_resource_id: resourceId
      });

      if (error) throw error;

      // Update local state with new count
      setResources(prev => prev.map(r =>
        r.id === resourceId ? {
          ...r,
          likes_count: data.likes_count
        } : r
      ));
    } catch (error) {
      console.error('Error liking resource:', error);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative"
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[50vh] flex items-center bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-800 z-10">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-google-blue/10 to-transparent rounded-full blur-3xl opacity-40 dark:opacity-10"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -60, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-google-green/10 to-transparent rounded-full blur-3xl opacity-40 dark:opacity-10"
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700 shadow-sm mb-8"
          >
            <BookOpen className="w-4 h-4 text-google-blue" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Learning Resources</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Resources & <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-green to-google-yellow">Learning</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Curated collection of tutorials, tools, and resources to help you learn and grow as a developer.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 space-y-6"
        >
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-google-blue/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-google-blue text-white shadow-lg shadow-google-blue/30'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-google-blue/50 dark:hover:border-google-blue/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
                <div className="h-56 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No resources found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search query</p>
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
          >
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                onClick={() => handleResourceClick(resource)}
                className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-700 group cursor-pointer transition-all duration-300 flex flex-col h-full"
              >
                {/* Thumbnail */}
                <div className="relative h-56 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                  {resource.thumbnail_url ? (
                    <img
                      src={resource.thumbnail_url}
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-4xl font-bold opacity-30">{resource.title.charAt(0)}</span>
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                  {resource.is_featured && (
                    <div className="absolute top-4 right-4 bg-yellow-400/90 backdrop-blur-sm text-yellow-950 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg z-10">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Featured
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className={`text-xs px-3 py-1.5 rounded-lg font-bold backdrop-blur-md shadow-sm border border-white/20 text-white ${resource.category === 'Video' ? 'bg-red-500/80' :
                      resource.category === 'Course' ? 'bg-blue-500/80' :
                        'bg-gray-900/60'
                      }`}>
                      {resource.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${resource.type === 'Free' ? 'border-green-200 text-green-600 dark:border-green-900/30 dark:text-green-400' :
                      'border-orange-200 text-orange-600 dark:border-orange-900/30 dark:text-orange-400'
                      }`}>
                      {resource.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 dark:text-white group-hover:text-google-blue transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">
                    {resource.description}
                  </p>

                  {/* Stats & Metadata */}
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <div className="flex items-center gap-4">
                      {/* Like Button */}
                      <button
                        onClick={(e) => handleLike(e, resource.id)}
                        className="flex items-center gap-1.5 transition-colors group/btn text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <Heart className="w-4 h-4 transition-all duration-300 group-hover/btn:fill-current" />
                        <span className="font-medium">{resource.likes_count || 0}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{resource.views_count || 0}</span>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-google-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>

                {/* Bottom Gradient Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-google-blue to-google-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}