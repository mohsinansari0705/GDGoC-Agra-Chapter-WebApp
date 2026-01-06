import React from "react";
import { Calendar, Users, BookOpen, Image, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  blobColor,
  delay,
  isLoading,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    className={`bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${
      isLoading ? "animate-pulse" : ""
    }`}
  >
    {/* Decorative Gradient Blob */}
    <div
      className={`absolute top-0 right-0 w-32 h-32 ${blobColor} rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-500`}
      aria-hidden="true"
    />

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3.5 rounded-2xl ${color} shadow-lg shadow-gray-200 dark:shadow-none text-white`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            isLoading
              ? "text-gray-500 bg-gray-100 dark:bg-gray-700/40 dark:text-gray-200"
              : "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-300"
          }`}
        >
          {isLoading ? "Refreshing" : "Live"}
        </span>
      </div>

      <div>
        <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">
          {isLoading ? "…" : value ?? "—"}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
          {title}
        </p>
      </div>
    </div>
  </motion.div>
);

const DashboardStats = ({
  stats,
  recent,
  quickActions,
  isLoading,
  lastUpdatedAt,
}) => {
  if (!stats) return null;

  const lastUpdatedLabel = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleString()
    : "—";

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Overview
          </h2>
          <span className="text-sm font-medium text-gray-400">
            Last updated: {isLoading ? "Refreshing…" : lastUpdatedLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Events"
            value={stats.events}
            icon={Calendar}
            color="bg-gradient-to-br from-sharda-blue to-blue-600"
            blobColor="bg-sharda-blue/10"
            delay={0}
            isLoading={isLoading}
          />
          <StatsCard
            title="Active Members"
            value={stats.members}
            icon={Users}
            color="bg-gradient-to-br from-sharda-red to-red-600"
            blobColor="bg-sharda-red/10"
            delay={0.1}
            isLoading={isLoading}
          />
          <StatsCard
            title="Published Posts"
            value={stats.posts}
            icon={BookOpen}
            color="bg-gradient-to-br from-sharda-yellow to-yellow-500"
            blobColor="bg-sharda-yellow/10"
            delay={0.2}
            isLoading={isLoading}
          />
          <StatsCard
            title="Gallery Photos"
            value={stats.gallery}
            icon={Image}
            color="bg-gradient-to-br from-sharda-green to-green-600"
            blobColor="bg-sharda-green/10"
            delay={0.3}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
            <span className="w-2 h-8 bg-sharda-blue rounded-full"></span>
            Quick Actions
          </h3>
          <div className="grid gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={isLoading}
                className={`w-full text-left p-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:shadow-lg ${
                  action.className ||
                  "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-sm">{action.label}</span>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-sharda-blue group-hover:scale-110 transition-all shadow-sm">
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
            <span className="w-2 h-8 bg-sharda-green rounded-full"></span>
            Recent Activity
          </h3>
          <div className="space-y-6">
            {/* Recent Event */}
            <div className="group flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-gray-50 dark:bg-gray-700/30 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-sharda-blue" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-sharda-blue text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    New Event
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {recent.event?.created_at
                      ? new Date(recent.event.created_at).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {recent.event?.title || "No events created recently"}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  Created a new community event for students.
                </p>
              </div>
              <button className="self-center p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-400 hover:text-sharda-blue shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Recent Post */}
            <div className="group flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-gray-50 dark:bg-gray-700/30 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors border border-transparent hover:border-yellow-100 dark:hover:border-yellow-900/30">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-sharda-yellow" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Blog Post
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {recent.post?.created_at
                      ? new Date(recent.post.created_at).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {recent.post?.title || "No blog posts published yet"}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  Published a new article on total tech.
                </p>
              </div>
              <button className="self-center p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-400 hover:text-sharda-yellow shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;
