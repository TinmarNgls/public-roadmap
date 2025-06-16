
import React from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/PageHeader';
import ChangelogDisplay from '@/components/ChangelogDisplay';

const Changelog = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#222529]">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full max-w-none">
        <PageHeader />
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">{t('changelog.title')}</h2>
          <p className="text-gray-400">{t('changelog.subtitle')}</p>
        </div>
        
        <ChangelogDisplay />
      </main>
    </div>
  );
};

export default Changelog;
