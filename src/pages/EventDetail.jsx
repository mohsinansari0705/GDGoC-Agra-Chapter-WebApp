import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  ExternalLink,
  Award,
  Target,
  Share2,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const EventDetail = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const [dbEvent, setDbEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!supabase) {
        setError("Database connection not available");
        setLoading(false);
        return;
      }
      
      if (!eventId) {
        setError("Invalid event ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch event by slug first, then by id
        let { data, error: fetchError } = await supabase
          .from("events")
          .select(
            "id,slug,title,category,status,description,date,end_date,time,location,cover_image_url,banner_image_url,registration_link,color,tags"
          )
          .eq("slug", eventId)
          .in("status", ["upcoming", "live", "completed"])
          .maybeSingle();

        // If not found by slug, try by id
        if (!data && !fetchError) {
          const result = await supabase
            .from("events")
            .select(
              "id,slug,title,category,status,description,date,end_date,time,location,cover_image_url,banner_image_url,registration_link,color,tags"
            )
            .eq("id", eventId)
            .in("status", ["upcoming", "live", "completed"])
            .maybeSingle();
          
          data = result.data;
          fetchError = result.error;
        }

        if (fetchError) throw fetchError;
        if (!data) {
          setError("Event not found");
          setLoading(false);
          return;
        }

        const base = {
          id: data.id,
          slug: data.slug || data.id,
          title: data.title || "",
          category: data.category || "",
          status: data.status || "",
          description: data.description || "",
          date: data.date || "",
          endDate: data.end_date || "",
          time: data.time || "",
          location: data.location || "",
          image: data.cover_image_url || "",
          bannerImage: data.banner_image_url || data.cover_image_url || "",
          registrationLink: data.registration_link || "",
          color: data.color || "from-blue-500 to-cyan-500",
          tags: Array.isArray(data.tags) ? data.tags : [],
        };

        const [timelineRes, themesRes, prizesRes] = await Promise.all([
          supabase
            .from("event_timeline_items")
            .select("title,date,time,description,label,order_index")
            .eq("event_id", data.id)
            .order("order_index", { ascending: true }),
          supabase
            .from("event_themes")
            .select("theme,order_index")
            .eq("event_id", data.id)
            .order("order_index", { ascending: true }),
          supabase
            .from("event_prizes")
            .select("position,amount,description,icon,order_index")
            .eq("event_id", data.id)
            .order("order_index", { ascending: true }),
        ]);

        const anyErr = timelineRes.error || themesRes.error || prizesRes.error;
        if (anyErr) {
          console.error("Error fetching event sub-data:", anyErr);
        }

        const schedule = (timelineRes.data || [])
          .map((row) => ({
            title: row.title || "",
            date: row.date || "",
            time: row.time || "",
            description: row.description || "",
            type: row.label || "",
          }))
          .filter((row) => row.title);
        
        console.log("Timeline data fetched:", timelineRes.data);
        console.log("Mapped schedule:", schedule);

        const themes = (themesRes.data || [])
          .map((row) => (row.theme || "").trim())
          .filter(Boolean);

        const prizes = (prizesRes.data || [])
          .map((row) => ({
            position: row.position || "",
            amount: row.amount || "",
            icon: row.icon || "",
            description: row.description || "",
          }))
          .filter((row) => row.position);

        const mapped = {
          ...base,
          tagline: base.category || "EVENT",
          schedule,
          themes,
          prizes,
        };

        console.log("Final mapped event object:", mapped);
        console.log("Schedule array:", schedule);
        console.log("Schedule length:", schedule?.length);

        if (!isMounted) return;
        setDbEvent(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event details:", err);
        if (isMounted) {
          setError("Failed to load event details");
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-google-blue mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !dbEvent) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || "Event not found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const event = dbEvent;
  const coverImage = String(event?.bannerImage || event?.image || "").trim();

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30 dark:opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Immersive Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
           <img
            src={coverImage}
            alt={event?.title || "Event cover"}
            className="w-full h-full object-cover opacity-50"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
           <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent`} />
           <div className={`absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-transparent`} />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
             <Link
                to="/events"
                className="absolute top-8 left-4 sm:left-6 lg:left-8 inline-flex items-center text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl"
            >
                <span className="inline-block px-4 py-1.5 rounded-full bg-google-blue/90 text-white text-sm font-bold mb-6 shadow-lg shadow-blue-900/20 backdrop-blur-sm border border-white/10 tracking-wide uppercase">
                  {(event.tagline || event.category || "EVENT").toUpperCase()}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-xl">
                {event.title}
                </h1>
                 {Array.isArray(event.tags) && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {event.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 text-white text-sm font-semibold shadow-lg hover:bg-white/25 transition-all cursor-default"
                      >
                        <span className="text-google-blue mr-1.5 text-base">#</span>
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                )}
            </motion.div>
        </div>
      </div>

       {/* Floating Info Bar - Enhanced */}
       <div className="-mt-24 relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
                className="relative bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-gray-200/50 dark:border-gray-700/50 p-8 lg:p-10 overflow-hidden"
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-google-blue/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-google-red/5 to-transparent rounded-full blur-3xl"></div>
                
                <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 flex-1">
                        <motion.div 
                            whileHover={{ y: -4, scale: 1.05 }}
                            className="flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-br from-google-blue/10 to-transparent hover:from-google-blue/20 transition-all border border-google-blue/20 hover:border-google-blue/40"
                        >
                         <div className="flex items-center gap-2 mb-1">
                             <Calendar className="w-5 h-5 text-google-blue" />
                             <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</span>
                         </div>
                         <p className="font-bold text-gray-900 dark:text-white text-base">
                           {formatDate(event.date)}
                           {event.endDate && event.endDate !== event.date && (
                             <span className="font-normal"> To {formatDate(event.endDate)}</span>
                           )}
                         </p>
                    </motion.div>
                    
                    <motion.div 
                        whileHover={{ y: -4, scale: 1.05 }}
                        className="flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-br from-google-red/10 to-transparent hover:from-google-red/20 transition-all border border-google-red/20 hover:border-google-red/40"
                    >
                         <div className="flex items-center gap-2 mb-1">
                             <Clock className="w-5 h-5 text-google-red" />
                             <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Time</span>
                         </div>
                         <p className="font-bold text-gray-900 dark:text-white text-lg">{event.time}</p>
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -4, scale: 1.05 }}
                        className="flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-br from-google-green/10 to-transparent hover:from-google-green/20 transition-all border border-google-green/20 hover:border-google-green/40"
                    >
                         <div className="flex items-center gap-2 mb-1">
                             <MapPin className="w-5 h-5 text-google-green" />
                             <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Location</span>
                         </div>
                         <p className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2">{event.location}</p>
                    </motion.div>
                    </div>

                    {event?.registrationLink && event.registrationLink !== "#" && (
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-google-blue to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
                      >
                        Register Now
                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.a>
                    )}
                </div>
            </motion.div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            {/* About */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-8 rounded-full bg-google-yellow"></span>
                About This Event
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                <div className="whitespace-pre-wrap">{event.description}</div>
              </div>
            </motion.section>

            {/* Themes/Problem Statements (if available) - MOVED ABOVE SCHEDULE */}
            {Array.isArray(event.themes) && event.themes.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                   <span className="w-2 h-8 rounded-full bg-google-red"></span>
                  Problem Statements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.themes.map((theme, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs hover:shadow-xl transition-all duration-300 flex items-start group"
                    >
                         <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mr-4 shrink-0 group-hover:rotate-12 transition-transform">
                             <Target className="w-6 h-6 text-google-red" />
                         </div>
                        <span className="font-bold text-gray-900 dark:text-white text-lg mt-2 group-hover:text-google-red transition-colors">
                          {theme}
                        </span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Event Schedule */}
            {(() => {
              console.log("Render check - event.schedule:", event.schedule);
              console.log("Is array?", Array.isArray(event.schedule));
              console.log("Length:", event.schedule?.length);
              return Array.isArray(event.schedule) && event.schedule.length > 0;
            })() && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 rounded-full bg-google-blue"></span>
                  Event Schedule
                </h2>
                <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-google-blue before:to-transparent">
                  {event.schedule.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                       <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 bg-google-blue shadow-lg group-hover:scale-125 transition-transform duration-300 ring-2 ring-white dark:ring-gray-900"></div>
                      <div className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-google-blue transition-colors">
                            {item.title}
                          </h3>
                           {item.type && (
                            <span className="self-start md:self-auto bg-blue-50 dark:bg-blue-900/30 text-google-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100 dark:border-blue-800">
                                {item.type}
                            </span>
                           )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl w-fit">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-google-red" />
                                {item.date}
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-google-green" />
                                {item.time}
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar - Sticky */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8 h-fit">
            {/* Prizes */}
            {Array.isArray(event.prizes) && event.prizes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-google-yellow/10 via-yellow-50 to-amber-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-yellow-100 dark:border-gray-700"
              >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-google-yellow/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="flex items-center mb-8 relative z-10">
                  <div className="p-2 bg-yellow-500/20 dark:bg-yellow-500/20 rounded-lg mr-3">
                      <Award className="w-6 h-6 text-google-yellow" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Prizes
                  </h3>
                </div>
                
                <div className="space-y-4 relative z-10">
                  {event.prizes.map((prize, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="bg-white/80 dark:bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-yellow-200/50 dark:border-white/10 flex items-center gap-4 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm hover:shadow-md"
                    >
                        <div className="text-4xl filter drop-shadow-md">{prize.icon}</div>
                        <div>
                             <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">{prize.position}</p>
                             <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-google-yellow to-amber-600 dark:from-google-yellow dark:to-yellow-200">{prize.amount}</p>
                        </div>
                    </motion.div>
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share This Event
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const url = window.location.href;
                    const text = `Check out ${event.title} - ${event.description.substring(0, 100)}...`;
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    const url = window.location.href;
                    const text = `Check out ${event.title}`;
                    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    window.open(linkedinUrl, '_blank');
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
