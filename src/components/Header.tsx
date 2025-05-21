
import React from 'react';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="mb-1 text-xl font-bold text-gray-900">
              Product Roadmap
            </h1>
            <p className="mt-0 text-sm text-gray-500 mt-1">
              Vote and comment on upcoming features
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
            >
              GitHub
            </a>
            <img 
              src="/lovable-uploads/25759202-3791-4ca0-8fe6-e6da11f9aca1.png" 
              alt="Shotgun Logo" 
              className="h-8" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
