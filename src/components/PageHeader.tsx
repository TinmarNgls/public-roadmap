
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

const PageHeader: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  return (
    <div className="mb-16 py-0">
      {/* Top Navigation Banner */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
        <div className="flex items-center gap-8">
          <Link 
            to="/"
            className={`transition-colors font-medium ${
              location.pathname === '/' 
                ? 'text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Roadmap
          </Link>
          <Link 
            to="/changelog"
            className={`transition-colors font-medium ${
              location.pathname === '/changelog' 
                ? 'text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Changelog
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <img src="/lovable-uploads/25759202-3791-4ca0-8fe6-e6da11f9aca1.png" alt="Shotgun Logo" className="h-5" />
        </div>
      </div>
      
      {/* Mobile layout: Logo and language selector at top */}
      <div className="flex lg:hidden justify-between items-center mb-6">
        <img src="/lovable-uploads/25759202-3791-4ca0-8fe6-e6da11f9aca1.png" alt="Shotgun Logo" className="h-5" />
        <LanguageSelector />
      </div>
      
      {/* Desktop layout: Side by side */}
      <div className="hidden lg:flex justify-between items-start gap-24 my-0 py-0 pt-1">
        <div>
          <h2 className="text-3xl font-bold text-gray-100 mb-2 mt-0">
            {t('header.title')}
          </h2>
          <p className="text-gray-400">
            {t('header.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <img src="/lovable-uploads/25759202-3791-4ca0-8fe6-e6da11f9aca1.png" alt="Shotgun Logo" className="h-5" />
        </div>
      </div>
      
      {/* Mobile title and subtitle below logo */}
      <div className="lg:hidden">
        <h2 className="text-3xl font-bold text-gray-100 mb-2 mt-0">
          {t('header.title')}
        </h2>
        <p className="text-gray-400">
          {t('header.subtitle')}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
