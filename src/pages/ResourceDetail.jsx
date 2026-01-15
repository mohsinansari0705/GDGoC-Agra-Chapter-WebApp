import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import {
  ExternalLink,
  Heart,
  Eye,
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Share2,
  Check
} from 'lucide-react';
import { pageTransition, fadeInUp } from '../utils/animations';

export default function ResourceDetail() {
  const { slug } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    fetchResource();
  }, [slug]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_resource_details', {
        p_resource_identifier: slug
      });

      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        setError('Resource not found');
        return;
      }

      setResource(data[0]);

      // Increment view count
      await supabase.rpc('increment_resource_views', {
        p_resource_id: data[0].id
      });

    } catch (err) {
      console.error('Error fetching resource:', err);
      setError(err.message || 'Failed to load resource');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!resource) return;

    try {
      const { data, error } = await supabase.rpc('increment_resource_like', {
        p_resource_id: resource.id
      });

      if (error) throw error;

      setIsLiked(true);
      setResource(prev => ({
        ...prev,
        likes_count: data.likes_count
      }));
    } catch (error) {
      console.error('Error liking resource:', error);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setToast({ show: true, message: 'Link copied to clipboard!' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }).catch(() => {
      setToast({ show: true, message: 'Failed to copy link' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-google-blue"></div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Resource not found'}
          </h2>
          <Link
            to="/resources"
            className="text-google-blue hover:text-google-blue/80 font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Hero Section with Banner */}
      <section className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-google-blue dark:hover:text-google-blue mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Resources
          </Link>

          <motion.div
            variants={fadeInUp}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Banner Image */}
            <div className="relative h-96 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
              {resource.thumbnail_url ? (
                <img
                  src={resource.thumbnail_url}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white text-9xl font-bold">
                  {resource.title.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex gap-3 flex-wrap">
                <span className={`px-4 py-2 rounded-full font-semibold shadow-lg ${getCategoryColor(resource.category)}`}>
                  {resource.category}
                </span>
                <span className={`px-4 py-2 rounded-full font-semibold shadow-lg ${getTypeColor(resource.type)}`}>
                  {resource.type}
                </span>
                {resource.is_featured && (
                  <span className="px-4 py-2 rounded-full font-bold bg-yellow-400 text-yellow-900 shadow-lg">
                    ⭐ Featured
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {resource.title}
              </h1>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-8">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked
                      ? 'text-pink-500 dark:text-pink-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${
                    isLiked ? 'fill-current' : ''
                  }`} />
                  <span className="font-semibold">{resource.likes_count} Likes</span>
                </button>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">{resource.views_count} Views</span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-google-blue dark:hover:text-blue-400 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-semibold">Share</span>
                </button>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">
                    {new Date(resource.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {resource.description}
                </div>
              </div>

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Creator Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Added By
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-google-blue to-google-green flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0">
                    {resource.admin_profile_image ? (
                      <img
                        src={resource.admin_profile_image}
                        alt={resource.admin_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      resource.admin_name?.charAt(0) || 'A'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                      {resource.admin_name || 'Admin'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                      {resource.admin_email}
                    </p>
                    {resource.admin_team_name && (
                      <p className="text-gray-500 dark:text-gray-500 text-sm">
                        {resource.admin_team_name} • {resource.admin_position}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-google-blue to-google-green hover:shadow-xl text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] text-lg"
              >
                <span>Visit Resource</span>
                <ExternalLink className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

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
    </motion.div>
  );
}
