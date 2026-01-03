import React from 'react';
import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Google Developer Group on Campus<br />
              Sharda University Agra
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Sharda University Agra<br />
              18 KM from Bhagwan Talkies towards Mathura,<br />
              Agra-Delhi Highway, Keetham, Agra - 282007
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Empowering students to innovate and create impactful solutions through technology.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/events" className="text-gray-600 dark:text-gray-400 hover:text-google-blue text-sm">
                  Events
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-google-blue text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-gray-600 dark:text-gray-400 hover:text-google-blue text-sm">
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Connect</h4>
            <div className="flex space-x-3">
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-google-blue hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-google-blue hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-google-blue hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-google-blue hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:gdgagra@srmist.edu.in"
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-google-blue hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-4">
              <Link
                to="/contact"
                className="text-sm text-google-blue hover:underline"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2026 GDGoC Agra Chapter. All rights reserved.<br />
            Built with ❤️ by the GDGoC Technical Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
