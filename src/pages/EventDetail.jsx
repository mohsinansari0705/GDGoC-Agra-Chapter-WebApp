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
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const EventDetail = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const [dbEvent, setDbEvent] = useState(null);

  const isUuid = useMemo(
    () =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        String(eventId || "")
      ),
    [eventId]
  );

  // Mock event data - In production, this would come from an API or state management
  const eventsDatabase = {
    "techsprint-2026": {
      title: "TechSprint",
      tagline: "HACKATHON",
      date: "Jan 30, 2026",
      endDate: "Feb 1, 2026",
      time: "9:00 AM onwards",
      location: "SRM Campus, Agra",
      participants: "500+ Expected",
      status: "Registrations Open",
      color: "from-red-500 to-orange-500",
      description:
        "An open-innovation hackathon where students developers get 36 hours to learn, collaborate, and compete in one of the most exciting student hackathon around. Organized by GDG on Campus SRM Institute of Science and Technology - Sharda University, Agra. Participate in full flow, take up real-life problems and use the latest and greatest technologies from Google, and other partners and get a chance to win from massive pool prizes, and learn like never before!",
      schedule: [
        {
          title: "Registration and Team Formation",
          date: "Dec 20, 2025 - Jan 25, 2026",
          time: "Dec 25 12:00 PM",
          description:
            "Register as a team or as individuals and let the organizers help you form a team of 2-4.",
          type: "external",
        },
        {
          title: "Project Submission",
          date: "Dec 25, 2025 - Jan 25, 2026",
          time: "Jan 26 10:00 PM",
          description:
            "Email the submission guidelines and quickly log by the deadline",
          type: "external",
        },
        {
          title: "Initial Evaluation",
          date: "Jan 26, 12:00 PM - Jan 27, 8:00 PM",
          time: "External",
          description:
            "Evaluation of the submissions on the judging parameters",
          type: "external",
        },
        {
          title: "Top 10 Announcement",
          date: "Jan 28, 2026 - Jan 28, 6:00 PM",
          time: "External",
          description: "Initial 10 of the top 10 performing teams",
          type: "external",
        },
        {
          title: "Top 10 Teams Final Pitching",
          date: "Jan 30, 2026 - Jan 30, 8:00 PM",
          time: "External",
          description: "Final showdown and evaluation of the top 3 projects",
          type: "external",
        },
        {
          title: "Final Announcement of Winners",
          date: "Feb 1, 2026 - Feb 1, 8:00 PM",
          time: "External",
          description: "Final announcement of the top 3 teams",
          type: "external",
        },
      ],
      prizes: [
        { position: "1st Place", amount: "₹50,000", icon: "🥇" },
        { position: "2nd Place", amount: "₹30,000", icon: "🥈" },
        { position: "3rd Place", amount: "₹20,000", icon: "🥉" },
      ],
      themes: [
        "Healthcare & Wellness",
        "Education Technology",
        "Sustainable Development",
        "Fintech Innovation",
        "Smart Cities",
        "Open Innovation",
      ],
    },
    "vividglyph-2025": {
      title: "VividGlyph",
      tagline: "HACKATHON",
      date: "Sep 15, 2025",
      time: "11:00 AM",
      location: "SRM Campus, Agra",
      participants: "450+ Participated",
      status: "Completed",
      color: "from-blue-500 to-cyan-500",
      description:
        "VividGlyph is a 24-hour long, one-of-a-kind Inter college Designathon. Open to all design aficionados to put problem-solving skills to the test and use design to solve real-world problems.",
      schedule: [
        {
          title: "Registration Opens",
          date: "Aug 20, 2025",
          time: "10:00 AM",
          description: "Registration portal opens for all participants",
          type: "external",
        },
        {
          title: "Design Challenge Begins",
          date: "Sep 15, 2025",
          time: "11:00 AM",
          description: "Participants receive the design challenge",
          type: "external",
        },
        {
          title: "Mid-Event Checkpoint",
          date: "Sep 15, 2025",
          time: "11:00 PM",
          description: "Teams present their progress to mentors",
          type: "external",
        },
        {
          title: "Final Submissions",
          date: "Sep 16, 2025",
          time: "11:00 AM",
          description: "Teams submit their final designs",
          type: "external",
        },
      ],
      prizes: [
        { position: "1st Place", amount: "₹25,000", icon: "🥇" },
        { position: "2nd Place", amount: "₹15,000", icon: "🥈" },
        { position: "3rd Place", amount: "₹10,000", icon: "🥉" },
      ],
    },
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!supabase) return;
      if (!isUuid) return;

      try {
        let base = location?.state?.event || null;

        if (!base) {
          const { data, error } = await supabase
            .from("events")
            .select(
              "id,title,category,status,description,date,end_date,time,location,participants,image_url,registration_link,color"
            )
            .eq("id", eventId)
            .maybeSingle();

          if (error) throw error;
          if (!data) return;

          base = {
            id: data.id,
            title: data.title || "",
            category: data.category || "",
            status: data.status || "",
            description: data.description || "",
            date: data.date || "",
            endDate: data.end_date || "",
            time: data.time || "",
            location: data.location || "",
            participants: data.participants || "",
            image: data.image_url || "",
            registrationLink: data.registration_link || "",
            color: data.color || "from-blue-500 to-cyan-500",
          };
        }

        const [timelineRes, themesRes, prizesRes] = await Promise.all([
          supabase
            .from("event_timeline_items")
            .select("title,date,time,description,label,order_index")
            .eq("event_id", eventId)
            .order("order_index", { ascending: true }),
          supabase
            .from("event_themes")
            .select("theme,order_index")
            .eq("event_id", eventId)
            .order("order_index", { ascending: true }),
          supabase
            .from("event_prizes")
            .select("position,amount,description,icon,order_index")
            .eq("event_id", eventId)
            .order("order_index", { ascending: true }),
        ]);

        const anyErr = timelineRes.error || themesRes.error || prizesRes.error;
        if (anyErr) throw anyErr;

        const schedule = (timelineRes.data || [])
          .map((row) => ({
            title: row.title || "",
            date: row.date || "",
            time: row.time || "",
            description: row.description || "",
            type: row.label || "",
          }))
          .filter((row) => row.title);

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
          tagline: base.tagline || base.category || "EVENT",
          schedule,
          themes,
          prizes,
        };

        if (!isMounted) return;
        setDbEvent(mapped);
      } catch {
        // Keep fallback data on any error
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [eventId, isUuid, location?.state?.event]);

  const event =
    dbEvent ||
    location?.state?.event ||
    eventsDatabase[eventId] ||
    eventsDatabase["techsprint-2026"];

  const coverImage =
    String(event?.image || event?.image_url || "").trim() ||
    "https://via.placeholder.com/1200x600/4285F4/ffffff?text=Event";

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
                  {event.tagline || event.category || "EVENT"}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-xl">
                {event.title}
                </h1>
                 <p className="text-lg md:text-xl text-gray-200 max-w-2xl line-clamp-2 drop-shadow-md">
                    {event.description}
                </p>
            </motion.div>
        </div>
      </div>

       {/* Floating Info Bar */}
       <div className="-mt-24 relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-white/20 dark:border-gray-700 p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-8"
            >
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full lg:w-auto">
                    <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-2 text-google-blue mb-1">
                             <Calendar className="w-5 h-5" />
                             <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Date</span>
                         </div>
                         <p className="font-bold text-gray-900 dark:text-white text-lg">{event.date.split(',')[0]}</p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-2 text-google-red mb-1">
                             <Clock className="w-5 h-5" />
                             <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Time</span>
                         </div>
                         <p className="font-bold text-gray-900 dark:text-white text-lg">{event.time}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-2 text-google-green mb-1">
                             <MapPin className="w-5 h-5" />
                             <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Location</span>
                         </div>
                         <p className="font-bold text-gray-900 dark:text-white text-lg truncate max-w-[150px]" title={event.location}>{event.location}</p>
                    </div>

                     <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-2 text-google-yellow mb-1">
                             <Users className="w-5 h-5" />
                             <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Joined</span>
                         </div>
                         <p className="font-bold text-gray-900 dark:text-white text-lg">{event.participants}</p>
                    </div>
               </div>

                {event?.registrationLink && event.registrationLink !== "#" && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={event.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-google-blue to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center whitespace-nowrap group"
                  >
                    Register Now
                    <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                )}
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
                <p>{event.description}</p>
              </div>
            </motion.section>

            {/* Event Schedule */}
            {Array.isArray(event.schedule) && event.schedule.length > 0 && (
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
                       <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 bg-google-blue shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
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

            {/* Themes (if available) */}
            {Array.isArray(event.themes) && event.themes.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
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
          </div>

          {/* Sidebar - Sticky */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8 h-fit">
            {/* Prizes */}
            {Array.isArray(event.prizes) && event.prizes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
              >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-google-yellow/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="flex items-center mb-8 relative z-10">
                  <div className="p-2 bg-yellow-500/20 rounded-lg mr-3">
                      <Award className="w-6 h-6 text-google-yellow" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    Prizes
                  </h3>
                </div>
                
                <div className="space-y-4 relative z-10">
                  {event.prizes.map((prize, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors"
                    >
                        <div className="text-4xl filter drop-shadow-md">{prize.icon}</div>
                        <div>
                             <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{prize.position}</p>
                             <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-google-yellow to-yellow-200">{prize.amount}</p>
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
                  <p className="font-semibold text-gray-900 dark:text-white">
                    VividGlyph
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sep 15, 2025
                  </p>
                </Link>
                <Link
                  to="/events/google-cloud-study-jams"
                  className="block p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Google Cloud Study Jams
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Oct 1, 2025
                  </p>
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
