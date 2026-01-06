import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BookOpen,
  Image,
  LogOut,
  X,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "sharda-blue" },
    { id: "events", label: "Events", icon: Calendar, color: "sharda-red" },
    { id: "members", label: "Members", icon: Users, color: "sharda-yellow" },
    { id: "blog", label: "Blog Posts", icon: BookOpen, color: "sharda-green" },
    { id: "gallery", label: "Gallery", icon: Image, color: "sharda-blue" },
  ];

  const getColorClasses = (color) => {
    const map = {
        "sharda-blue": {
            shadow: "shadow-sharda-blue/25",
            gradient: "from-sharda-blue to-blue-600"
        },
        "sharda-red": {
            shadow: "shadow-sharda-red/25",
            gradient: "from-sharda-red to-red-600"
        },
        "sharda-yellow": {
            shadow: "shadow-sharda-yellow/25",
            gradient: "from-sharda-yellow to-yellow-500"
        },
        "sharda-green": {
            shadow: "shadow-sharda-green/25",
            gradient: "from-sharda-green to-green-600"
        }
    };
    return map[color] || map["sharda-blue"]; 
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-r border-gray-100 dark:border-gray-700 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sharda-blue/10 to-transparent pointer-events-none"></div>

      <div className="p-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sharda-blue to-sharda-red flex items-center justify-center shadow-lg shadow-sharda-blue/30">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight block leading-none">
              Admin
            </span>
            <span className="text-xs font-bold text-sharda-yellow tracking-widest uppercase">
              Panel
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4 relative z-10">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const style = getColorClasses(item.color);
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? `text-white shadow-lg ${style.shadow}`
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {isActive && (
                 <div className={`absolute inset-0 bg-gradient-to-r ${style.gradient} rounded-2xl`}></div>
              )}
              
              <div className={`relative z-10 p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700'}`}>
                   <Icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? "scale-100" : "group-hover:scale-110"
                    }`}
                />
              </div>
             
              <span className={`font-semibold relative z-10 tracking-wide ${isActive ? "" : ""}`}>{item.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-lg shadow-white/50"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 relative z-10">
        <div className="p-4 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
             <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold text-sm uppercase tracking-wide hover:shadow-sm"
                >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
            </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 w-80 lg:hidden"
      >
        {sidebarContent}
      </motion.aside>

      <aside className="hidden lg:block w-80 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
