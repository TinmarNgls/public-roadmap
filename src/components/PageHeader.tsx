
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const PageHeader: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-16 py-0">
      <div className="flex justify-between items-start gap-24 my-0 py-0 pt-1">
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
    </div>
  );
};

export default PageHeader;
