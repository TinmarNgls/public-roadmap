
import React from 'react';

const PageHeader: React.FC = () => {
  return (
    <div className="mb-16 py-0">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-100 mb-2">
            What We're Building (Together)
          </h2>
          <p className="text-gray-400">
            Explore what's coming, vote on features, and let us know what would make Shotgun even better for your events
          </p>
        </div>
        <div>
          <img 
            src="/lovable-uploads/25759202-3791-4ca0-8fe6-e6da11f9aca1.png" 
            alt="Shotgun Logo" 
            className="h-10" 
          />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
