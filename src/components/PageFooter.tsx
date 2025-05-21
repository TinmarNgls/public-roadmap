
import React from 'react';

const PageFooter: React.FC = () => {
  return (
    <footer className="py-6 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">© 2025 Project Feedback Platform. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
