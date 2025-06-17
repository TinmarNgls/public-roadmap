
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatAnnouncementDate } from '@/utils/dateUtils';
import { getTranslatedContent } from '@/utils/translationUtils';

interface ChangelogAnnouncementProps {
  announcement: {
    id: string;
    date: string;
    title_en: string;
    title_fr?: string;
    title_pt_pt?: string;
    title_pt_br?: string;
    content_en: string;
    content_fr?: string;
    content_pt_pt?: string;
    content_pt_br?: string;
  };
}

const ChangelogAnnouncement: React.FC<ChangelogAnnouncementProps> = ({ announcement }) => {
  const { i18n } = useTranslation();
  
  // Get translated content based on current language
  const { title, content } = getTranslatedContent(announcement, i18n.language);
  
  return (
    <div className="flex flex-col lg:flex-row lg:gap-8">
      {/* Date - stacked on mobile, left side on desktop, aligned with title baseline */}
      <div className="lg:w-48 lg:flex-shrink-0 lg:text-right mb-4 lg:mb-0 lg:pt-1">
        <span className="text-gray-400 text-sm font-medium">
          {formatAnnouncementDate(announcement.date, i18n.language)}
        </span>
      </div>
      
      {/* Content - full width on mobile, constrained on desktop */}
      <div className="flex-1 lg:max-w-4xl">
        <h3 className="text-xl lg:text-2xl font-semibold text-gray-100 mb-4 lg:mb-6 leading-tight">{title}</h3>
        
        {/* Render HTML content safely */}
        <div 
          className="prose prose-invert prose-sm lg:prose-lg max-w-none
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
            prose-strong:text-gray-100 prose-strong:font-semibold
            prose-em:text-gray-300 prose-em:italic
            prose-ul:text-gray-300 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
            prose-li:text-gray-300 prose-li:mb-2
            prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300
            prose-a:transition-colors
            prose-h1:text-gray-100 prose-h1:text-lg lg:prose-h1:text-xl prose-h1:font-semibold prose-h1:mb-4
            prose-h2:text-gray-100 prose-h2:text-base lg:prose-h2:text-lg prose-h2:font-semibold prose-h2:mb-3
            prose-h3:text-gray-100 prose-h3:text-sm lg:prose-h3:text-base prose-h3:font-semibold prose-h3:mb-2"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default ChangelogAnnouncement;
