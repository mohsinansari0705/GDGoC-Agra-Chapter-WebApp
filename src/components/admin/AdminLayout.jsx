import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

const AdminLayout = ({
  children,
  activeTab,
  setActiveTab,
  onLogout,
  headerTitle,
  headerSubtitle,
  headerRight,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0B0F19] overflow-hidden selection:bg-sharda-blue/20 selection:text-sharda-blue">
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sharda-blue/5 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sharda-red/5 blur-[100px]"></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-sharda-yellow/5 blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-sharda-green/5 blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <div className="lg:pl-80 flex flex-col min-h-screen transition-all duration-300">
          <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 lg:hidden px-6 py-4 flex items-center justify-between shadow-sm">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-gray-900 dark:text-white text-lg">
              Admin <span className="text-sharda-red">Panel</span>
            </span>
            <div className="w-10" /> {/* Spacer for centering */}
          </header>

          <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto">
              {(headerTitle || headerSubtitle || headerRight) && (
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0">
                    {headerTitle && (
                      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {headerTitle}
                      </h1>
                    )}
                    {headerSubtitle && (
                      <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-3xl">
                        {headerSubtitle}
                      </p>
                    )}
                  </div>
                  {headerRight && <div className="shrink-0">{headerRight}</div>}
                </div>
              )}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
