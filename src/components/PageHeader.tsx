
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

const PageHeader: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isRoadmapPage = location.pathname === '/';
  
  return (
    <div className="mb-8 py-0">
      {/* Sticky Top Navigation Banner */}
      <div className="sticky top-0 bg-[#222529] z-50 flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
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
      
      {/* Show "What we're building together" section only on roadmap page */}
      {isRoadmapPage && (
        <>
          {/* Mobile layout: Title and subtitle */}
          <div className="flex lg:hidden justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-100 mb-2 mt-0">
                {t('header.title')}
              </h2>
              <p className="text-gray-400">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
          
          {/* Desktop layout: Title and subtitle */}
          <div className="hidden lg:flex justify-between items-start gap-24 my-0 py-0 pt-1">
            <div>
              <h2 className="text-3xl font-bold text-gray-100 mb-2 mt-0">
                {t('header.title')}
              </h2>
              <p className="text-gray-400">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PageHeader;
