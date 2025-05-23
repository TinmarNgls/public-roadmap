
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
        </div>
      </div>
    </header>
  );
};

export default Header;
