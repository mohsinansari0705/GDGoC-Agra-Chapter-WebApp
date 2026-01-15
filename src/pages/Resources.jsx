import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import {
  Search, Filter, BookOpen, ExternalLink, Heart, Eye, Star, X, Calendar, Share2, Check, ChevronDown
} from 'lucide-react';
import { fadeInUp, staggerContainer, pageTransition } from '../utils/animations';

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
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);

  const [likedResources, setLikedResources] = useState(new Set());
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResources();
    // Load liked resources from local storage
    const loadedLikes = new Set();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('liked_resource_')) {
        loadedLikes.add(key.replace('liked_resource_', ''));
      }
    });
    setLikedResources(loadedLikes);
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, selectedCategory, searchQuery]);

  useEffect(() => {
    console.log('Filtered resources:', filteredResources);
  }, [filteredResources]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_resources_with_admin');

      if (error) throw error;
      console.log('Fetched resources:', data);
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

  const handleResourceClick = async (resource) => {
    setSelectedResource(resource);

    // Increment view count
    try {
      await supabase.rpc('increment_resource_views', {
        p_resource_id: resource.id
      });

      // Update local state
      setResources(prev => prev.map(r =>
        r.id === resource.id ? { ...r, views_count: r.views_count + 1 } : r
      ));
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const handleLike = async (e, resourceId) => {
    e.stopPropagation();

    // Visual update: "Pink Icon" logic
    if (!likedResources.has(resourceId)) {
      setLikedResources(prev => new Set([...prev, resourceId]));
      localStorage.setItem(`liked_resource_${resourceId}`, 'true');
    }

    try {
      // Use the function that definitely exists in DB (plural)
      const { data, error } = await supabase.rpc('increment_resource_likes', {
        row_id: resourceId
      });

      if (error) throw error;

      // Simple state update: just increment counts
      setResources(prev => prev.map(r =>
        r.id === resourceId ? { ...r, likes_count: (r.likes_count || 0) + 1 } : r
      ));

    } catch (error) {
      console.error('Error liking resource:', error);
    }
  };


  const handleShare = (e, resource) => {
    e.stopPropagation();
    const slug = resource.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const url = `${window.location.origin}/resources/${slug}`;

    navigator.clipboard.writeText(url).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy link');
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Tutorial: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      Documentation: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      Tool: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      Article: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      Video: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      Course: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
      Book: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
      Template: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
      Other: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    return colors[category] || colors.Other;
  };

  const getTypeColor = (type) => {
    const colors = {
      Free: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      Paid: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      Freemium: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
    };
    return colors[type] || colors.Free;
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
          {/* Search & Filter Container */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto relative z-20">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-google-blue transition-colors" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-google-blue/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative w-full md:w-64">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-200 hover:border-google-blue/50 dark:hover:border-google-blue/50 transition-colors shadow-sm"
              >
                <span className="font-medium">{selectedCategory === 'All' ? 'All Categories' : selectedCategory}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showCategoryDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-80 overflow-y-auto z-50 p-2"
                  >
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between group ${selectedCategory === category
                          ? 'bg-google-blue/10 text-google-blue dark:bg-google-blue/20 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                      >
                        <span className="font-medium">{category}</span>
                        {selectedCategory === category && (
                          <Check className="w-4 h-4 text-google-blue" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                        className={`flex items-center gap-1.5 transition-colors group/btn ${likedResources.has(resource.id)
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                          }`}
                      >
                        <Heart className={`w-4 h-4 transition-all duration-300 ${likedResources.has(resource.id) ? 'fill-current scale-110' : 'group-hover/btn:fill-current'
                          }`} />
                        <span className="font-medium">{resource.likes_count || 0}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{resource.views_count || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleShare(e, resource)}
                        className="text-gray-400 hover:text-google-blue transition-colors p-1"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-semibold text-google-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Details <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Gradient Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-google-blue to-google-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Resource Detail Modal */}
        <AnimatePresence>
          {selectedResource && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResource(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700"
              >
                {/* Header with Thumbnail */}
                <div className="relative h-72 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
                  {selectedResource.thumbnail_url ? (
                    <img
                      src={selectedResource.thumbnail_url}
                      alt={selectedResource.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white text-9xl font-bold">
                      {selectedResource.title.charAt(0)}
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2.5 rounded-full transition-all shadow-lg"
                  >
                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </button>
                  {selectedResource.is_featured && (
                    <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full flex items-center gap-2 font-bold shadow-lg">
                      <Star className="w-5 h-5 fill-current" />
                      Featured Resource
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Title and Tags */}
                  <div className="flex items-start gap-3 mb-4 flex-wrap">
                    <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${getCategoryColor(selectedResource.category)}`}>
                      {selectedResource.category}
                    </span>
                    <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${getTypeColor(selectedResource.type)}`}>
                      {selectedResource.type}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{selectedResource.title}</h2>

                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                    {selectedResource.description}
                  </p>

                  {/* Tags */}
                  {selectedResource.tags && selectedResource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedResource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Eye className="w-5 h-5" />
                      <span className="font-semibold">{selectedResource.views_count} Views</span>
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-600">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Added By</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-google-blue to-google-green flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0">
                        {selectedResource.admin_profile_image ? (
                          <img
                            src={selectedResource.admin_profile_image}
                            alt={selectedResource.admin_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          selectedResource.admin_name?.charAt(0) || 'A'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg text-gray-900 dark:text-white truncate">{selectedResource.admin_name || 'Admin'}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm truncate">{selectedResource.admin_email}</p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> Added on {new Date(selectedResource.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700 mt-8">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => handleLike(e, selectedResource.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 transform active:scale-95 ${likedResources.has(selectedResource.id)
                          ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 ring-2 ring-red-500/20'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10 dark:hover:text-red-400'
                          }`}
                      >
                        <Heart className={`w-5 h-5 ${likedResources.has(selectedResource.id) ? 'fill-current' : ''}`} />
                        <span>{selectedResource.likes_count || 0} Likes</span>
                      </button>

                      <button
                        onClick={(e) => handleShare(e, selectedResource)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-google-blue dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-semibold"
                      >
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                    </div>

                    <a
                      href={selectedResource.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-google-blue to-blue-600 hover:from-blue-600 hover:to-google-blue text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <span>Open Resource</span>
                      <ExternalLink className="ml-2 w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-semibold"
            >
              <div className="bg-green-500 rounded-full p-1">
                <Check className="w-3 h-3 text-white" />
              </div>
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
