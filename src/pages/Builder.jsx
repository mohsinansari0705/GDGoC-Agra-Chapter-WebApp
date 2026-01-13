import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, Code2, Sparkles, ArrowLeft, ExternalLink, Briefcase, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const Builder = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-google-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-google-yellow/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-google-red/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-google-blue dark:hover:text-google-blue transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Easter Egg Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-google-yellow to-google-red text-white rounded-full text-sm font-bold mb-6 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            🎉 You found the secret page! 🎉
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-google-blue via-google-red to-google-yellow p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring", bounce: 0.5 }}
              className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-white shadow-xl overflow-hidden"
            >
              <img 
                src="https://avatars.githubusercontent.com/u/168951191?s=400&u=e5ae0a43398f7e7a6e2c598159701f2d53f9ae46&v=4"
                alt="Mohsin Ansari"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Meet The Builder</h1>
            <p className="text-xl text-white/90">The Mind Behind This Website</p>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="text-4xl">👋</span>
                Hello, I'm Mohsin Ansari
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  A passionate <span className="font-bold text-google-blue">Full-Stack Developer</span> and 
                  <span className="font-bold text-google-red"> Tech Innovator</span> who crafted this website from scratch. 
                  I specialize in building <span className="font-semibold">modern web applications</span>, <span className="font-semibold">Android apps</span>, 
                  and <span className="font-semibold">AI/ML solutions</span> that deliver exceptional user experiences.
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mt-4">
                  With <span className="font-semibold">2 complete Android applications</span>, multiple <span className="font-semibold">enterprise web apps</span>, 
                  and expertise in <span className="font-semibold">AI/ML integration</span> & <span className="font-semibold">deployment automation</span>, 
                  I transform ideas into reality. From frontend to backend, mobile to cloud, I build complete solutions that make a difference.
                </p>
              </div>
            </motion.div>

            {/* Skills/Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-10"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-google-blue" />
                Tech Stack Used
              </h3>
              <div className="flex flex-wrap gap-3">
                {["React", "Android", "Node.js", "Python", "AI/ML", "Tailwind CSS", "Supabase", "Firebase", "Docker", "AWS", "PostgreSQL"].map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white rounded-full font-semibold text-sm border border-blue-200 dark:border-gray-600 shadow-sm"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-gradient-to-br from-google-blue/10 via-google-red/10 to-google-yellow/10 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 mb-10 border border-google-blue/20 dark:border-gray-600"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-google-green/20 rounded-xl">
                  <Briefcase className="w-6 h-6 text-google-green" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Let's Build Something Amazing Together! 🚀
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    I'm available for <span className="font-bold text-google-blue">freelance projects</span> and 
                    <span className="font-bold text-google-red"> startup collaborations</span>. Whether you need a <span className="font-semibold">complete web application</span>, 
                    <span className="font-semibold"> Android app</span>, <span className="font-semibold">AI/ML integration</span>, 
                    or <span className="font-semibold">cloud deployment</span>, I'm here to help bring your vision to life.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3 bg-white dark:bg-gray-700 p-4 rounded-xl">
                  <Rocket className="w-5 h-5 text-google-blue mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Startup Projects</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Web, Android, AI/ML - Full-stack MVP development</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white dark:bg-gray-700 p-4 rounded-xl">
                  <Code2 className="w-5 h-5 text-google-red mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Freelance Work</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Full-stack development & consulting</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                📬 Get In Touch
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GitHub */}
                <motion.a
                  href="https://github.com/mohsinansari0705"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:shadow-xl transition-all group"
                >
                  <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Github className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white/70">GitHub</p>
                    <p className="font-semibold">@mohsinansari0705</p>
                  </div>
                  <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href="https://www.linkedin.com/in/mohsinansari0705/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 bg-[#0077b5] text-white rounded-xl hover:shadow-xl transition-all group"
                >
                  <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white/70">LinkedIn</p>
                    <p className="font-semibold">Mohsin Ansari</p>
                  </div>
                  <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </motion.a>

                {/* Email */}
                <motion.a
                  href="mailto:your.email@example.com"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-google-red to-red-600 text-white rounded-xl hover:shadow-xl transition-all group"
                >
                  <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white/70">Email</p>
                    <p className="font-semibold">code.mohsinansari0705@gmail.com</p>
                  </div>
                </motion.a>

                {/* Phone */}
                <motion.a
                  href="tel:+918881729524"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-google-green to-green-600 text-white rounded-xl hover:shadow-xl transition-all group"
                >
                  <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white/70">Phone</p>
                    <p className="font-semibold">+91 88817 29524</p>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-10 text-center"
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                💡 <span className="font-semibold">Pro Tip:</span> Click the GDGoC logo 3 times to find this page again!
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                Built with ❤️ using React, Tailwind CSS, and Supabase
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Builder;
