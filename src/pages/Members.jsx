import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Github, Twitter, Trophy, Loader2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { fadeInUp, staggerContainer, pageTransition } from "../utils/animations";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      if (!supabase || !isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError("");

      try {
        // Call the get_members_hierarchy function
        const { data, error } = await supabase.rpc("get_members_hierarchy");

        if (error) throw error;
        setMembers(data || []);
      } catch (err) {
        console.error("Error loading members:", err);
        setLoadError(err?.message || "Failed to load members");
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, []);

  // Generate initials for placeholder images
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get color for team
  const getTeamColor = (teamName) => {
    const name = teamName.toLowerCase();
    if (name.includes("lead organizer")) return "yellow";
    if (name.includes("technical")) return "blue";
    if (name.includes("events") || name.includes("operations")) return "red";
    if (name.includes("pr") || name.includes("outreach")) return "green";
    if (name.includes("social media") || name.includes("content")) return "yellow";
    if (name.includes("design") || name.includes("editing")) return "red";
    if (name.includes("disciplinary")) return "green";
    return "blue";
  };

  // Get position label
  const getPositionLabel = (position) => {
    const labels = {
      lead: "Lead Organizer",
      head: "Head",
      "co-head": "Co-Head",
      executive: "Executive",
    };
    return labels[position] || position;
  };

  // Group members by team
  const groupedMembers = members.reduce((acc, member) => {
    if (!acc[member.team_name]) {
      acc[member.team_name] = {
        teamName: member.team_name,
        color: getTeamColor(member.team_name),
        lead: null,
        heads: [],
        executives: [],
      };
    }

    if (member.position === "lead") {
      acc[member.team_name].lead = member;
    } else if (member.position === "head" || member.position === "co-head") {
      acc[member.team_name].heads.push(member);
    } else if (member.position === "executive") {
      acc[member.team_name].executives.push(member);
    }

    return acc;
  }, {});

  // Convert to array and sort (Lead Organizer first, then others)
  const teamsArray = Object.values(groupedMembers).sort((a, b) => {
    if (a.teamName === "Lead Organizer") return -1;
    if (b.teamName === "Lead Organizer") return 1;
    return 0;
  });

  const MemberCard = ({ member, isLarger = false }) => (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className={`bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden group relative ${
        isLarger ? "md:col-span-2 lg:col-span-1" : ""
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-google-blue/5 to-google-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="p-8 text-center relative z-10">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-google-blue via-google-red to-google-yellow opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
          <img
            src={
              member.profile_image_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                member.name
              )}&size=200&background=4285F4&color=fff&bold=true`
            }
            alt={member.name}
            className={`${
              isLarger ? "w-32 h-32" : "w-28 h-28"
            } rounded-full relative z-10 object-cover border-4 border-white dark:border-gray-800 shadow-md group-hover:scale-105 transition-transform duration-300`}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                member.name
              )}&size=200&background=4285F4&color=fff&bold=true`;
            }}
          />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-google-blue transition-colors">
          {member.name}
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">
          {getPositionLabel(member.position)}
        </p>

        <div className="flex justify-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full hover:bg-[#0077b5] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.github_url && (
            <a
              href={member.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full hover:bg-[#333] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {member.x_url && (
            <a
              href={member.x_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full hover:bg-[#000] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-google-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-google-yellow/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/30 text-google-green font-semibold text-sm mb-6"
          >
            <Trophy className="w-4 h-4" />
            <span>The Dream Team</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Meet our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-green to-google-yellow">
              Core Team
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            The talented developers, designers, and community leaders driving
            innovation at GDG on Campus.
          </motion.p>
        </div>
      </section>

      {/* Members Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-google-blue animate-spin mb-4" />
            <p className="text-center text-gray-600 dark:text-gray-300">
              Loading members...
            </p>
          </div>
        ) : loadError ? (
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400 mb-4">{loadError}</p>
            <p className="text-gray-500 dark:text-gray-400">
              Unable to load team members. Please try again later.
            </p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">
              No team members found.
            </p>
          </div>
        ) : (
          <>
            {teamsArray.map((team) => (
              <section key={team.teamName} className="mb-20">
                {/* Team Header */}
                <div className="flex items-center mb-8">
                  <div
                    className={`h-8 w-1 bg-google-${team.color} rounded-full mr-4`}
                  ></div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    {team.teamName}
                  </motion.h2>
                  <div className="h-px bg-gray-200 dark:bg-gray-800 flex-grow ml-6"></div>
                </div>

                {/* Lead Organizer (if exists) */}
                {team.lead && (
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 justify-items-center"
                  >
                    <MemberCard member={team.lead} isLarger={true} />
                  </motion.div>
                )}

                {/* Heads and Co-Heads */}
                {team.heads.length > 0 && (
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8"
                  >
                    {team.heads.map((member) => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </motion.div>
                )}

                {/* Executives */}
                {team.executives.length > 0 && (
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  >
                    {team.executives.map((member) => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </motion.div>
                )}
              </section>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Members;