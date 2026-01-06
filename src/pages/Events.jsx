import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Clock, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { fadeInUp, staggerContainer, pageTransition, scaleIn, fadeIn } from "../utils/animations";

const Events = () => {
  const [filter, setFilter] = useState("all");

  const fallbackEvents = useMemo(
    () => [
      {
        id: "techsprint-2026",
        title: "TechSprint",
        date: "Jan 30, 2026",
        endDate: "Feb 1, 2026",
        time: "9:00 AM",
        location: "SRM Campus, Agra",
        category: "Hackathon",
        status: "upcoming",
        participants: "500+",
        description:
          "An open-innovation hackathon where students developers get 36 hours to learn, collaborate, and compete in one of the most exciting student hackathon around.",
        image:
          "https://via.placeholder.com/600x400/EA4335/ffffff?text=TechSprint",
        color: "from-red-500 to-orange-500",
        registrationLink: "#",
      },
      {
        id: "promptrush-2025",
        title: "PromptRush 2.0",
        date: "Sep 12, 2025",
        time: "10:00 AM",
        location: "Online",
        category: "Workshop",
        status: "past",
        participants: "300+",
        description:
          "Unlock the power of innovation with Google AI and Cloud. Designed for budding AI engineers including Data Engineers.",
        image:
          "https://via.placeholder.com/600x400/FBBC04/ffffff?text=PromptRush",
        color: "from-yellow-500 to-amber-500",
      },
      {
        id: "vividglyph-2025",
        title: "VividGlyph",
        date: "Sep 15, 2025",
        time: "11:00 AM",
        location: "SRM Campus, Agra",
        category: "Hackathon",
        status: "past",
        participants: "450+",
        description:
          "VividGlyph is a 24-hour long, one-of-a-kind Inter college Designathon. Open to all design aficionados to put problem-solving skills to the test.",
        image:
          "https://via.placeholder.com/600x400/4285F4/ffffff?text=VividGlyph",
        color: "from-blue-500 to-cyan-500",
      },
      {
        id: "google-cloud-study-jams",
        title: "Google Cloud Study Jams",
        date: "Oct 1, 2025",
        time: "2:00 PM",
        location: "Online",
        category: "Workshop",
        status: "past",
        participants: "600+",
        description:
          "A cohort of learning Google Cloud Platform built for beginners with weekly learning sessions and resources from Google.",
        image:
          "https://via.placeholder.com/600x400/34A853/ffffff?text=Study+Jams",
        color: "from-green-500 to-emerald-500",
      },
      {
        id: "cyberverse-2024",
        title: "CyberVerse",
        date: "Apr 20, 2025",
        time: "9:00 AM",
        location: "SRM Campus, Agra",
        category: "Hackathon",
        status: "past",
        participants: "400+",
        description:
          "CyberVerse brings together budding tech enthusiasts to collaborate on real-world cyber security challenges.",
        image:
          "https://via.placeholder.com/600x400/9C27B0/ffffff?text=CyberVerse",
        color: "from-purple-500 to-pink-500",
      },
      {
        id: "autocoder-2024",
        title: "AutoCoder 2.0",
        date: "Feb 10, 2025",
        time: "3:00 PM",
        location: "Online",
        category: "Coding Competition",
        status: "past",
        participants: "350+",
        description:
          "The Digital Harvesting Challenge! Put your creativity and technology skills to the test.",
        image:
          "https://via.placeholder.com/600x400/FF5722/ffffff?text=AutoCoder",
        color: "from-orange-500 to-red-500",
      },
    ],
    []
  );

  const [eventsData, setEventsData] = useState(fallbackEvents);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from("events")
          .select(
            "id,title,category,status,description,date,end_date,time,location,participants,image_url,registration_link,color,created_at"
          )
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;

        const mapped = (data || []).map((event) => {
          const statusRaw = String(event.status || "").trim();
          const statusLower = statusRaw.toLowerCase();
          const normalizedStatus =
            statusLower === "past" ||
            statusLower === "completed" ||
            statusLower.includes("past") ||
            statusLower.includes("completed")
              ? "past"
              : "upcoming";

          const imageUrlRaw = String(event.image_url || "").trim();

          return {
            id: event.id,
            title: event.title || "",
            date: event.date || "",
            endDate: event.end_date || "",
            time: event.time || "",
            location: event.location || "",
            category: event.category || "Event",
            status: normalizedStatus,
            participants: event.participants || "",
            description: event.description || "",
            image:
              imageUrlRaw ||
              "https://via.placeholder.com/600x400/4285F4/ffffff?text=Event",
            color: event.color || "from-blue-500 to-cyan-500",
            registrationLink: event.registration_link || "#",
          };
        });

        if (!isMounted) return;
        if (mapped.length > 0) setEventsData(mapped);
      } catch {
        // Keep fallback data on any error
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [fallbackEvents]);

  const categories = useMemo(() => {
    const base = ["all", "Hackathon", "Workshop", "Coding Competition"];
    const extra = Array.from(
      new Set(
        (eventsData || [])
          .map((e) => e.category)
          .filter((c) => c && !base.includes(c))
      )
    );
    return [...base, ...extra];
  }, [eventsData]);

  const filteredEvents =
    filter === "all"
      ? eventsData
      : eventsData.filter((event) => event.category === filter);

  const upcomingEvents = filteredEvents.filter((e) => e.status === "upcoming");
  const pastEvents = filteredEvents.filter((e) => e.status === "past");

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
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
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
                  variants={fadeInUp}
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
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-3 py-1.5 rounded-full">
                        Upcoming
                      </span>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 z-10 w-full pr-8">
                       <span className={`text-xs font-bold px-3 py-1 rounded-full bg-${event.color.split('-')[1]}-500 text-white mb-2 inline-block`}>
                        {event.category}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-google-blue transition-colors leading-tight">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <div className="flex items-center">
                             <Calendar className="w-4 h-4 mr-2 text-google-blue" />
                             {event.date}
                        </div>
                         <div className="flex items-center">
                             <Clock className="w-4 h-4 mr-2 text-google-red" />
                             {event.time}
                        </div>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                       <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                       <div className="flex items-center">
                        <Users className="w-4 h-4 mr-3 text-gray-400" />
                        <span>{event.participants} registered</span>
                      </div>
                    </div>

                    <Link
                      to={`/events/${event.id}`}
                      state={{ event }}
                      className="block w-full text-center py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-semibold hover:bg-google-blue hover:text-white transition-all duration-300"
                    >
                      View Details
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
                  variants={fadeInUp}
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
                       <span className="text-sm text-gray-500">{event.participants} attended</span>
                       <Link
                        to={`/events/${event.id}`}
                        state={{ event }}
                        className="text-sm font-semibold text-gray-900 dark:text-white hover:text-google-blue"
                      >
                        Recap →
                      </Link>
                    </div>
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
    </motion.div>
  );
};

export default Events;
