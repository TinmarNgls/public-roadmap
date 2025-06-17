
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useEnhancedTranslation } from '@/hooks/useEnhancedTranslation';

interface ChangelogAnnouncement {
  id: string;
  date: string;
  title: string;
  content: string;
}

// Component for translating and rendering announcement content
const TranslatedAnnouncement: React.FC<{ announcement: ChangelogAnnouncement }> = ({ announcement }) => {
  const { translatedText: translatedTitle } = useEnhancedTranslation(announcement.title, 'en');
  const { translatedText: translatedContent } = useEnhancedTranslation(announcement.content, 'en');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative flex items-start">
      {/* Date on the left */}
      <div className="w-44 flex-shrink-0 text-right pr-6">
        <span className="text-gray-400 text-sm font-medium">
          {formatDate(announcement.date)}
        </span>
      </div>
      
      {/* Content */}
      <div className="ml-8 bg-[#383b3e] rounded-lg p-6 border border-gray-700 flex-1">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">{translatedTitle}</h3>
        
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
          dangerouslySetInnerHTML={{ __html: translatedContent }}
        />
      </div>
    </div>
  );
};

const ChangelogDisplay: React.FC = () => {
  const { t } = useTranslation();
  
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['changelog-announcements'],
    queryFn: async () => {
      console.log('Fetching changelog announcements...');

      const { data, error } = await supabase
        .from('changelog_announcements')
        .select('id, date, title, content')
        .eq('published', true)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }

      console.log('Fetched announcements:', data);
      return data as ChangelogAnnouncement[];
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Loading changelog...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-48 top-0 bottom-0 w-0.5 bg-gray-700"></div>
        
        <div className="space-y-8">
          {announcements.map((announcement) => (
            <TranslatedAnnouncement key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangelogDisplay;
