
import React from 'react';

const PageFooter: React.FC = () => {
  return (
    <footer className="bg-[#1a1c23] border-t border-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            © 2025 <a href="https://shotgun.live/" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400">Shotgun</a>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
