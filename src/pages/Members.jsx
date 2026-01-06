import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Github, Twitter, Code2, Camera, Palette, Terminal, Trophy } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { fadeInUp, staggerContainer, pageTransition, hoverScale } from "../utils/animations";

const Members = () => {
  const fallbackTeam = {
    overall: [
      {
        name: "Dhruv Singh",
        role: "Overall Lead",
        image: "https://via.placeholder.com/150/4285F4/ffffff?text=DS",
        socials: { linkedin: "#", github: "#", twitter: "#" },
      },
    ],
    aiml: [
      {
        name: "Ayush Pratap Singh",
        role: "AI/ML Lead",
        image: "https://via.placeholder.com/150/EA4335/ffffff?text=APS",
        socials: { linkedin: "#", github: "#" },
      },
    ],
    webDev: [
      {
        name: "Sumit Meharotra",
        role: "Web Development Lead",
        image: "https://via.placeholder.com/150/4285F4/ffffff?text=SM",
        socials: { linkedin: "#", github: "#", twitter: "#" },
      },
      {
        name: "Suryh Mathur",
        role: "Web Development Member",
        image: "https://via.placeholder.com/150/4285F4/ffffff?text=SM2",
        socials: { linkedin: "#", github: "#" },
      },
      {
        name: "Sarthak Rajput",
        role: "Web Development Member",
        image: "https://via.placeholder.com/150/4285F4/ffffff?text=SR",
        socials: { linkedin: "#", github: "#" },
      },
      {
        name: "Akash Khalde",
        role: "Web Development Member",
        image: "https://via.placeholder.com/150/4285F4/ffffff?text=AK",
        socials: { linkedin: "#", github: "#" },
      },
      {
        name: "Anushka Madugula",
        role: "Web Development Member",
        image: "https://via.placeholder.com/150/4285F4/ffffff?text=AM",
        socials: { linkedin: "#", github: "#" },
      },
      {
        name: "Arman Garg",
        role: "Web Development Member",
        image: "https://via.placeholder.com/150/4285F4/ffffff?text=AG",
        socials: { linkedin: "#", github: "#" },
      },
    ],
    contentPhotography: [
      {
        name: "Utkarsh Lira",
        role: "Content & Photography Lead",
        image: "https://via.placeholder.com/150/FBBC04/ffffff?text=UL",
        socials: { linkedin: "#", twitter: "#" },
      },
    ],
    designVisual: [
      {
        name: "Anushree Bhargava",
        role: "Design & Visuals Lead",
        image: "https://via.placeholder.com/150/EA4335/ffffff?text=AB",
        socials: { linkedin: "#", twitter: "#" },
      },
      {
        name: "Dhruv Kaul",
        role: "Design & Visuals Member",
        image: "https://via.placeholder.com/150/EA4335/ffffff?text=DK",
        socials: { linkedin: "#" },
      },
      {
        name: "Pranav Garg",
        role: "Design & Visuals Member",
        image: "https://via.placeholder.com/150/EA4335/ffffff?text=PG",
        socials: { linkedin: "#", twitter: "#" },
      },
    ],
    management: [
      {
        name: "Divyansh Ojha",
        role: "Management Lead",
        image: "https://via.placeholder.com/150/FBBC04/ffffff?text=DO",
        socials: { linkedin: "#" },
      },
      {
        name: "Kartik Singh",
        role: "Management Member",
        image: "https://via.placeholder.com/150/FBBC04/ffffff?text=KS",
        socials: { linkedin: "#", twitter: "#" },
      },
      {
        name: "Vikramaditya Mittal",
        role: "Management Member",
        image: "https://via.placeholder.com/150/FBBC04/ffffff?text=VM",
        socials: { linkedin: "#", twitter: "#" },
      },
    ],
  };

  const [teamRows, setTeamRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!supabase || !isSupabaseConfigured) return;

      setIsLoading(true);
      setLoadError("");
      try {
        const { data, error } = await supabase
          .from("members")
          .select(
            "id,name,team_name,team_head,team_head_image_url,team_head_linkedin_url,team_head_github_url,team_head_twitter_url,team_co_head,team_co_head_image_url,team_co_head_linkedin_url,team_co_head_github_url,team_co_head_twitter_url,executive_1,executive_1_image_url,executive_1_linkedin_url,executive_1_github_url,executive_1_twitter_url,executive_2,executive_2_image_url,executive_2_linkedin_url,executive_2_github_url,executive_2_twitter_url,executive_3,executive_3_image_url,executive_3_linkedin_url,executive_3_github_url,executive_3_twitter_url,executive_4,executive_4_image_url,executive_4_linkedin_url,executive_4_github_url,executive_4_twitter_url,executive_5,executive_5_image_url,executive_5_linkedin_url,executive_5_github_url,executive_5_twitter_url,executive_6,executive_6_image_url,executive_6_linkedin_url,executive_6_github_url,executive_6_twitter_url,executive_7,executive_7_image_url,executive_7_linkedin_url,executive_7_github_url,executive_7_twitter_url,executive_8,executive_8_image_url,executive_8_linkedin_url,executive_8_github_url,executive_8_twitter_url,created_at"
          )
          .order("created_at", { ascending: false })
          .limit(200);

        if (error) throw error;
        if (cancelled) return;
        setTeamRows(data || []);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err?.message || "Failed to load members");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const initialsFor = (name) => {
    return (name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  };

  const normalizeUrl = (value) => {
    const trimmed = (value || "").trim();
    return trimmed ? trimmed : "";
  };

  const memberFromProfile = ({
    name,
    role,
    imageUrl,
    linkedinUrl,
    githubUrl,
    twitterUrl,
  }) => {
    const initials = initialsFor(name);
    const resolvedImage = normalizeUrl(imageUrl);
    return {
      name,
      role,
      image:
        resolvedImage ||
        `https://via.placeholder.com/150/4285F4/ffffff?text=${encodeURIComponent(
          initials || "GDG"
        )}`,
      socials: {
        linkedin: normalizeUrl(linkedinUrl),
        github: normalizeUrl(githubUrl),
        twitter: normalizeUrl(twitterUrl),
      },
    };
  };

  const underlineClassForTeam = (teamName) => {
    const name = (teamName || "").toLowerCase();
    if (name.includes("management")) return "border-google-yellow";
    if (name.includes("web")) return "border-google-blue";
    if (name.includes("ai") || name.includes("ml"))
      return "border-google-green";
    if (name.includes("design") || name.includes("visual"))
      return "border-google-red";
    if (name.includes("content") || name.includes("photography"))
      return "border-google-red";
    if (name.includes("overall")) return "border-google-yellow";
    return "border-google-blue";
  };

  const sections = useMemo(() => {
    if (teamRows.length === 0) {
      return [
        {
          title: "Overall",
          underlineClass: "border-google-yellow",
          members: fallbackTeam.overall,
        },
        {
          title: "AI/ML",
          underlineClass: "border-google-green",
          members: fallbackTeam.aiml,
        },
        {
          title: "Content and Photography",
          underlineClass: "border-google-red",
          members: fallbackTeam.contentPhotography,
        },
        {
          title: "Design and Visuals",
          underlineClass: "border-google-red",
          members: fallbackTeam.designVisual,
        },
        {
          title: "Management",
          underlineClass: "border-google-yellow",
          members: fallbackTeam.management,
        },
        {
          title: "Web Development",
          underlineClass: "border-google-blue",
          members: fallbackTeam.webDev,
        },
      ];
    }

    const preferredOrder = [
      "overall",
      "management",
      "web development",
      "ai/ml",
      "design",
      "content",
    ];

    const grouped = new Map();
    for (const row of teamRows) {
      const teamName = (row.team_name || row.name || "").trim();
      if (!teamName) continue;

      const people = [];
      if (row.team_head) {
        people.push(
          memberFromProfile({
            name: row.team_head,
            role: `${teamName} Lead`,
            imageUrl: row.team_head_image_url,
            linkedinUrl: row.team_head_linkedin_url,
            githubUrl: row.team_head_github_url,
            twitterUrl: row.team_head_twitter_url,
          })
        );
      }

      if (row.team_co_head) {
        people.push(
          memberFromProfile({
            name: row.team_co_head,
            role: `${teamName} Member`,
            imageUrl: row.team_co_head_image_url,
            linkedinUrl: row.team_co_head_linkedin_url,
            githubUrl: row.team_co_head_github_url,
            twitterUrl: row.team_co_head_twitter_url,
          })
        );
      }

      if (row.executive_1) {
        people.push(
          memberFromProfile({
            name: row.executive_1,
            role: `${teamName} Member`,
            imageUrl: row.executive_1_image_url,
            linkedinUrl: row.executive_1_linkedin_url,
            githubUrl: row.executive_1_github_url,
            twitterUrl: row.executive_1_twitter_url,
          })
        );
      }
      if (row.executive_2) {
        people.push(
          memberFromProfile({
            name: row.executive_2,
            role: `${teamName} Member`,
            imageUrl: row.executive_2_image_url,
            linkedinUrl: row.executive_2_linkedin_url,
            githubUrl: row.executive_2_github_url,
            twitterUrl: row.executive_2_twitter_url,
          })
        );
      }
      if (row.executive_3) {
        people.push(
          memberFromProfile({
            name: row.executive_3,
            role: `${teamName} Member`,
            imageUrl: row.executive_3_image_url,
            linkedinUrl: row.executive_3_linkedin_url,
            githubUrl: row.executive_3_github_url,
            twitterUrl: row.executive_3_twitter_url,
          })
        );
      }
      if (row.executive_4) {
        people.push(
          memberFromProfile({
            name: row.executive_4,
            role: `${teamName} Member`,
            imageUrl: row.executive_4_image_url,
            linkedinUrl: row.executive_4_linkedin_url,
            githubUrl: row.executive_4_github_url,
            twitterUrl: row.executive_4_twitter_url,
          })
        );
      }

      if (row.executive_5) {
        people.push(
          memberFromProfile({
            name: row.executive_5,
            role: `${teamName} Member`,
            imageUrl: row.executive_5_image_url,
            linkedinUrl: row.executive_5_linkedin_url,
            githubUrl: row.executive_5_github_url,
            twitterUrl: row.executive_5_twitter_url,
          })
        );
      }

      if (row.executive_6) {
        people.push(
          memberFromProfile({
            name: row.executive_6,
            role: `${teamName} Member`,
            imageUrl: row.executive_6_image_url,
            linkedinUrl: row.executive_6_linkedin_url,
            githubUrl: row.executive_6_github_url,
            twitterUrl: row.executive_6_twitter_url,
          })
        );
      }

      if (row.executive_7) {
        people.push(
          memberFromProfile({
            name: row.executive_7,
            role: `${teamName} Member`,
            imageUrl: row.executive_7_image_url,
            linkedinUrl: row.executive_7_linkedin_url,
            githubUrl: row.executive_7_github_url,
            twitterUrl: row.executive_7_twitter_url,
          })
        );
      }

      if (row.executive_8) {
        people.push(
          memberFromProfile({
            name: row.executive_8,
            role: `${teamName} Member`,
            imageUrl: row.executive_8_image_url,
            linkedinUrl: row.executive_8_linkedin_url,
            githubUrl: row.executive_8_github_url,
            twitterUrl: row.executive_8_twitter_url,
          })
        );
      }

      grouped.set(teamName, people);
    }

    const entries = Array.from(grouped.entries()).map(([teamName, members]) => {
      return {
        title: teamName,
        underlineClass: underlineClassForTeam(teamName),
        members,
      };
    });

    const score = (title) => {
      const lower = (title || "").toLowerCase();
      const idx = preferredOrder.findIndex((needle) => lower.includes(needle));
      return idx === -1 ? 999 : idx;
    };

    return entries.sort((a, b) => {
      const aScore = score(a.title);
      const bScore = score(b.title);
      if (aScore !== bScore) return aScore - bScore;
      return a.title.localeCompare(b.title);
    });
  }, [fallbackTeam, teamRows]);

  const MemberCard = ({ member, index }) => (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden group relative"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-google-blue/5 to-google-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
      <div className="p-8 text-center relative z-10">
        <div className="relative inline-block mb-6">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-google-blue via-google-red to-google-yellow opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300`}></div>
            <img
            src={member.image}
            alt={member.name}
            className="w-28 h-28 rounded-full relative z-10 object-cover border-4 border-white dark:border-gray-800 shadow-md group-hover:scale-105 transition-transform duration-300"
            />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-google-blue transition-colors">
          {member.name}
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider text-xs">{member.role}</p>
        
        <div className="flex justify-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full hover:bg-[#0077b5] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.socials.github && (
            <a
              href={member.socials.github}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full hover:bg-[#333] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {member.socials.twitter && (
            <a
              href={member.socials.twitter}
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
              aria-label="Twitter"
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
            Meet our <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-green to-google-yellow">Core Team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            The talented developers, designers, and community leaders driving innovation at GDG on Campus.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading members...
          </p>
        ) : loadError ? (
          <p className="text-center text-red-600 dark:text-red-400">
            {loadError}
          </p>
        ) : null}

        {sections.map((section) => (
          <section key={section.title} className="mb-20">
            <div className="flex items-center mb-8">
                <div className={`h-8 w-1 bg-${section.underlineClass.split('-')[1]}-${section.underlineClass.split('-')[2]} rounded-full mr-4`}></div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {section.title}
                </motion.h2>
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-grow ml-6"></div>
            </div>
            
            <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {section.members.map((member, index) => (
                <MemberCard
                  key={`${section.title}-${index}`}
                  member={member}
                  index={index}
                />
              ))}
            </motion.div>
          </section>
        ))}
      </div>
    </motion.div>
  );
};

export default Members;
