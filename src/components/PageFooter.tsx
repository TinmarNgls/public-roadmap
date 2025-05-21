
import React from 'react';

const PageFooter: React.FC = () => {
  return (
    <footer className="w-full py-6 bg-[#222529] border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Project Roadmap. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
