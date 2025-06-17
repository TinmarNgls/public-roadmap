
import React from 'react';
import { formatAnnouncementDate } from '@/utils/dateUtils';

interface ChangelogAnnouncementProps {
  announcement: {
    id: string;
    date: string;
    title: string;
    content: string;
  };
}

const ChangelogAnnouncement: React.FC<ChangelogAnnouncementProps> = ({ announcement }) => {
  return (
    <div className="relative flex items-start">
      {/* Date on the left */}
      <div className="w-44 flex-shrink-0 text-right pr-6">
        <span className="text-gray-400 text-sm font-medium">
          {formatAnnouncementDate(announcement.date)}
        </span>
      </div>
      
      {/* Content */}
      <div className="ml-8 bg-[#383b3e] rounded-lg p-6 border border-gray-700 flex-1">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">{announcement.title}</h3>
        
        {/* Render HTML content safely */}
        <div 
          className="prose prose-invert prose-sm max-w-none
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-strong:text-gray-100 prose-strong:font-semibold
            prose-em:text-gray-300 prose-em:italic
            prose-ul:text-gray-300 prose-ul:list-disc prose-ul:ml-4
            prose-li:text-gray-300 prose-li:mb-1
            prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300
            prose-a:transition-colors"
          dangerouslySetInnerHTML={{ __html: announcement.content }}
        />
      </div>
    </div>
  );
};

export default ChangelogAnnouncement;
