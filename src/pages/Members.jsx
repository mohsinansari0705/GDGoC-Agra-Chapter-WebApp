import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter, Mail } from 'lucide-react';

const Members = () => {
  const team = {
    overall: [
      {
        name: 'Dhruv Singh',
        role: 'Overall Lead',
        image: 'https://via.placeholder.com/150/4285F4/ffffff?text=DS',
        socials: { linkedin: '#', github: '#', twitter: '#' }
      }
    ],
    aiml: [
      {
        name: 'Ayush Pratap Singh',
        role: 'AI/ML Lead',
        image: 'https://via.placeholder.com/150/EA4335/ffffff?text=APS',
        socials: { linkedin: '#', github: '#' }
      }
    ],
    webDev: [
      {
        name: 'Sumit Meharotra',
        role: 'Web Development Lead',
        image: 'https://via.placeholder.com/150/4285F4/ffffff?text=SM',
        socials: { linkedin: '#', github: '#', twitter: '#' }
      },
      {
        name: 'Suryh Mathur',
        role: 'Web Development Member',
        image: 'https://via.placeholder.com/150/4285F4/ffffff?text=SM2',
        socials: { linkedin: '#', github: '#' }
      },
      {
        name: 'Sarthak Rajput',
        role: 'Web Development Member',
        image: 'https://via.placeholder.com/150/4285F4/ffffff?text=SR',
        socials: { linkedin: '#', github: '#' }
      },
      {
        name: 'Akash Khalde',
        role: 'Web Development Member',
        image: 'https://via.placeholder.com/150/4285F4/ffffff?text=AK',
        socials: { linkedin: '#', github: '#' }
      },
      {
        name: 'Anushka Madugula',
        role: 'Web Development Member',
        image: 'https://via.placeholder.com/150/4285F4/ffffff?text=AM',
        socials: { linkedin: '#', github: '#' }
      },
      {
        name: 'Arman Garg',
        role: 'Web Development Member',
        image: 'https://via.placeholder.com/150/4285F4/ffffff?text=AG',
        socials: { linkedin: '#', github: '#' }
      }
    ],
    contentPhotography: [
      {
        name: 'Utkarsh Lira',
        role: 'Content & Photography Lead',
        image: 'https://via.placeholder.com/150/FBBC04/ffffff?text=UL',
        socials: { linkedin: '#', twitter: '#' }
      }
    ],
    designVisual: [
      {
        name: 'Anushree Bhargava',
        role: 'Design & Visuals Lead',
        image: 'https://via.placeholder.com/150/EA4335/ffffff?text=AB',
        socials: { linkedin: '#', twitter: '#' }
      },
      {
        name: 'Dhruv Kaul',
        role: 'Design & Visuals Member',
        image: 'https://via.placeholder.com/150/EA4335/ffffff?text=DK',
        socials: { linkedin: '#' }
      },
      {
        name: 'Pranav Garg',
        role: 'Design & Visuals Member',
        image: 'https://via.placeholder.com/150/EA4335/ffffff?text=PG',
        socials: { linkedin: '#', twitter: '#' }
      }
    ],
    management: [
      {
        name: 'Divyansh Ojha',
        role: 'Management Lead',
        image: 'https://via.placeholder.com/150/FBBC04/ffffff?text=DO',
        socials: { linkedin: '#' }
      },
      {
        name: 'Kartik Singh',
        role: 'Management Member',
        image: 'https://via.placeholder.com/150/FBBC04/ffffff?text=KS',
        socials: { linkedin: '#', twitter: '#' }
      },
      {
        name: 'Vikramaditya Mittal',
        role: 'Management Member',
        image: 'https://via.placeholder.com/150/FBBC04/ffffff?text=VM',
        socials: { linkedin: '#', twitter: '#' }
      }
    ]
  };

  const MemberCard = ({ member, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6 text-center">
        <img
          src={member.image}
          alt={member.name}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-google-blue"
        />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {member.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {member.role}
        </p>
        <div className="flex justify-center gap-3">
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              className="p-2 bg-blue-100 dark:bg-blue-900/30 text-google-blue rounded-full hover:bg-google-blue hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.socials.github && (
            <a
              href={member.socials.github}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {member.socials.twitter && (
            <a
              href={member.socials.twitter}
              className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Our Members
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Meet the talented developers, designers, and community leaders who make GDGoC special
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overall Lead */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          >
            <span className="border-b-4 border-google-yellow pb-2">Overall</span>
          </motion.h2>
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              {team.overall.map((member, index) => (
                <MemberCard key={index} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* AI/ML Team */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          >
            <span className="border-b-4 border-google-green pb-2">AI/ML</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.aiml.map((member, index) => (
              <MemberCard key={index} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* Content & Photography */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          >
            <span className="border-b-4 border-google-red pb-2">Content and Photography</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.contentPhotography.map((member, index) => (
              <MemberCard key={index} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* Design & Visuals */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          >
            <span className="border-b-4 border-google-red pb-2">Design and Visuals</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.designVisual.map((member, index) => (
              <MemberCard key={index} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* Management */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          >
            <span className="border-b-4 border-google-yellow pb-2">Management</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.management.map((member, index) => (
              <MemberCard key={index} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* Web Development */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          >
            <span className="border-b-4 border-google-blue pb-2">Web Development</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.webDev.map((member, index) => (
              <MemberCard key={index} member={member} index={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Members;
