import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Code, FileText, ExternalLink } from 'lucide-react';

const Resources = () => {
  const resources = [
    {
      category: 'Web Development',
      color: 'bg-blue-500',
      icon: <Code className="w-8 h-8" />,
      items: [
        { title: 'React.js Official Documentation', link: 'https://react.dev', type: 'Documentation' },
        { title: 'MDN Web Docs', link: 'https://developer.mozilla.org', type: 'Documentation' },
        { title: 'Next.js Tutorial', link: 'https://nextjs.org/learn', type: 'Tutorial' },
        { title: 'Tailwind CSS Guide', link: 'https://tailwindcss.com/docs', type: 'Documentation' }
      ]
    },
    {
      category: 'AI/ML',
      color: 'bg-red-500',
      icon: <BookOpen className="w-8 h-8" />,
      items: [
        { title: 'Google AI Learning', link: 'https://ai.google/education/', type: 'Course' },
        { title: 'TensorFlow Tutorials', link: 'https://www.tensorflow.org/tutorials', type: 'Tutorial' },
        { title: 'Machine Learning Crash Course', link: 'https://developers.google.com/machine-learning/crash-course', type: 'Course' },
        { title: 'Kaggle Learn', link: 'https://www.kaggle.com/learn', type: 'Platform' }
      ]
    },
    {
      category: 'Cloud Computing',
      color: 'bg-yellow-500',
      icon: <Video className="w-8 h-8" />,
      items: [
        { title: 'Google Cloud Training', link: 'https://cloud.google.com/training', type: 'Course' },
        { title: 'Google Cloud Skills Boost', link: 'https://www.cloudskillsboost.google/', type: 'Platform' },
        { title: 'Firebase Documentation', link: 'https://firebase.google.com/docs', type: 'Documentation' },
        { title: 'Cloud Architecture Center', link: 'https://cloud.google.com/architecture', type: 'Guide' }
      ]
    },
    {
      category: 'Android Development',
      color: 'bg-green-500',
      icon: <Code className="w-8 h-8" />,
      items: [
        { title: 'Android Developer Guide', link: 'https://developer.android.com/guide', type: 'Documentation' },
        { title: 'Flutter Documentation', link: 'https://flutter.dev/docs', type: 'Documentation' },
        { title: 'Kotlin for Android', link: 'https://kotlinlang.org/docs/android-overview.html', type: 'Documentation' },
        { title: 'Jetpack Compose', link: 'https://developer.android.com/jetpack/compose', type: 'Framework' }
      ]
    },
    {
      category: 'Design & UI/UX',
      color: 'bg-purple-500',
      icon: <FileText className="w-8 h-8" />,
      items: [
        { title: 'Material Design', link: 'https://material.io/design', type: 'Guide' },
        { title: 'Google Design Resources', link: 'https://design.google/', type: 'Resources' },
        { title: 'Figma Community', link: 'https://www.figma.com/community', type: 'Platform' },
        { title: 'Design Principles', link: 'https://principles.design/', type: 'Guide' }
      ]
    },
    {
      category: 'Developer Tools',
      color: 'bg-indigo-500',
      icon: <Code className="w-8 h-8" />,
      items: [
        { title: 'VS Code Tips', link: 'https://code.visualstudio.com/docs', type: 'Documentation' },
        { title: 'Git Documentation', link: 'https://git-scm.com/doc', type: 'Documentation' },
        { title: 'Chrome DevTools', link: 'https://developer.chrome.com/docs/devtools/', type: 'Tool' },
        { title: 'GitHub Learning Lab', link: 'https://lab.github.com/', type: 'Course' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Resources
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Curated learning materials and resources for our community members
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {resources.map((category, categoryIndex) => (
            <motion.section
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center mb-6">
                <div className={`${category.color} p-3 rounded-lg text-white mr-4`}>
                  {category.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {category.category}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item, itemIndex) => (
                  <motion.a
                    key={itemIndex}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-google-blue group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-google-blue transition-colors">
                          {item.title}
                        </h3>
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                          {item.type}
                        </span>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-google-blue transition-colors" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Additional Resources Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-google-blue to-google-green p-8 rounded-2xl text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Need More Resources?</h2>
          <p className="text-lg mb-6">
            Join our community on Discord and connect with fellow learners to share resources and knowledge!
          </p>
          <button className="bg-white text-google-blue px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Join Community
          </button>
        </motion.section>
      </div>
    </div>
  );
};

export default Resources;