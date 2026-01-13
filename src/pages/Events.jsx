import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Clock, Search, Filter, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { fadeInUp, staggerContainer, pageTransition, scaleIn, fadeIn } from "../utils/animations";

const EventCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="h-56 bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
    </div>
  </div>
);

const Events = () => {
  const [filter, setFilter] = useState("all");
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!supabase) {
        setLoading(false);
        setError("Database connection not available");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from("events")
          .select(
            "id,slug,title,category,status,description,date,end_date,time,location,cover_image_url,banner_image_url,registration_link,color,featured,tags,created_at"
          )
          .in("status", ["upcoming", "live", "completed"])
          .order("date", { ascending: true })
          .limit(100);

        if (error) throw error;

        if (!isMounted) return;

        const mapped = (data || []).map((event) => {
          const statusRaw = String(event.status || "").trim().toLowerCase();
          // Use status directly from database: upcoming, live, completed
          let normalizedStatus = statusRaw;

          const imageUrlRaw = String(event.cover_image_url || "").trim();

          return {
            id: event.id,
            slug: event.slug || event.id,
            title: event.title || "",
            date: event.date || "",
            endDate: event.end_date || "",
            time: event.time || "",
            location: event.location || "",
            category: event.category || "Event",
            status: normalizedStatus,
            description: event.description || "",
            image: imageUrlRaw,
            bannerImage: String(event.banner_image_url || "").trim() || imageUrlRaw,
            color: event.color || "from-blue-500 to-cyan-500",
            registrationLink: event.registration_link || "#",
            featured: event.featured || false,
            tags: event.tags || [],
          };
        });

        setEventsData(mapped);
      } catch (err) {
        console.error("Error fetching events:", err);
        if (isMounted) setError("Failed to load events. Please try again later.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const allCategories = Array.from(
      new Set(
        (eventsData || [])
          .map((e) => e.category)
          .filter((c) => c)
      )
    );
    return ["all", ...allCategories];
  }, [eventsData]);

  const filteredEvents = useMemo(() => 
    filter === "all"
      ? eventsData
      : eventsData.filter((event) => event.category === filter),
    [filter, eventsData]
  );

  const upcomingEvents = useMemo(() => 
    filteredEvents.filter((e) => e.status === "upcoming"),
    [filteredEvents]
  );

  const liveEvents = useMemo(() => 
    filteredEvents.filter((e) => e.status === "live"),
    [filteredEvents]
  );
  
  const pastEvents = useMemo(() => 
    filteredEvents.filter((e) => e.status === "completed"),
    [filteredEvents]
  );

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
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-800 z-10">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-50 dark:bg-red-900/10 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-google-blue font-semibold text-sm mb-6"
          >
            <Calendar className="w-4 h-4" />
            <span>Community Gatherings</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Events & <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-red to-google-yellow">Meetups</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Join our community events to learn, connect, and grow with fellow developers in an inclusive environment.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          <div className="p-1 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 inline-flex flex-wrap gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`relative px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 z-10 ${
                  filter === category
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {filter === category && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gray-900 dark:bg-google-blue rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-google-blue"></div>
                <div className="absolute animate-ping rounded-full h-12 w-12 bg-google-blue opacity-20"></div>
                <div className="relative">
                  <Calendar className="w-8 h-8 text-google-blue" />
                </div>
              </div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300"
              >
                Loading events...
              </motion.p>
            </motion.div>
            
            {/* Skeleton Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          </>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-google-blue text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Live Events */}
        {!loading && liveEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Live Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveEvents.map((event, index) => (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                >
                  <motion.div
                    initial={{ opacity: 1 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 group cursor-pointer transition-all duration-300 h-full flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-green-500/95 backdrop-blur-md text-white border border-green-400/50 text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          Live
                        </span>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/30">
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </span>
                      </div>
                      
                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors leading-tight line-clamp-2">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-grow flex flex-col">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                        {event.description}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center flex-1">
                            <Calendar className="w-4 h-4 mr-2 text-google-blue" />
                            <span className="font-medium">{event.date}</span>
                          </div>
                          {event.time && (
                            <div className="flex items-center flex-1">
                              <Clock className="w-4 h-4 mr-2 text-google-red" />
                              <span className="font-medium">{event.time}</span>
                            </div>
                          )}
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-2 text-google-green flex-shrink-0" />
                            <span className="line-clamp-1 font-medium">{event.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-bold text-google-blue group-hover:underline">
                          View Event
                        </span>
                        <ArrowRight className="w-5 h-5 text-google-blue transform group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                    
                    {/* Bottom Accent */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {!loading && upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 1 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 group cursor-pointer transition-all duration-300"
                >
                  <div className="h-56 relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent`}
                      aria-hidden="true"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-blue-500/90 border-blue-400/50 text-white text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm">
                        Upcoming
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-google-blue uppercase tracking-wider">
                        {event.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-google-blue transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {event.date}
                      </div>
                      {event.time && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5" />
                          {event.time}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/events/${event.slug}`}
                      className="block w-full text-center py-3 bg-gradient-to-r from-google-blue to-blue-600 hover:from-blue-600 hover:to-google-blue text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 group"
                    >
                      <span className="flex items-center justify-center gap-2">
                        View Details
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {!loading && pastEvents.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 1 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 group cursor-pointer transition-all duration-300 opacity-75 hover:opacity-100"
                >
                  <div className="h-48 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent`}
                      aria-hidden="true"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Completed
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-google-blue transition-colors">
                      {event.title}
                    </h3>
                     
                     <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                     </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                       <Link
                        to={`/events/${event.slug}`}
                        className="text-sm font-semibold text-gray-900 dark:text-white hover:text-google-blue"
                      >
                        View Recap →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {filter === "all" ? "No events available" : "No events found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === "all" 
                ? "Check back soon for upcoming events"
                : "Try selecting a different category"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Events;
