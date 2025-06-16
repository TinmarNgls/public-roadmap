
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useEnhancedTranslation } from '@/hooks/useEnhancedTranslation';

interface ChangelogUpdate {
  id: string;
  text: string;
  link_url?: string;
  link_text?: string;
  sort_order: number;
}

interface ChangelogAnnouncement {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  updates: ChangelogUpdate[];
}

// Component for translating individual update items
const TranslatedUpdate: React.FC<{ update: ChangelogUpdate }> = ({ update }) => {
  const { translatedText: translatedText } = useEnhancedTranslation(update.text, 'en');
  const { translatedText: translatedLinkText } = useEnhancedTranslation(update.link_text || '', 'en');

  const renderUpdateText = () => {
    if (update.link_url && update.link_text && translatedLinkText) {
      // Split text around the original link text to create clickable links
      const parts = translatedText.split(update.link_text);
      if (parts.length === 2) {
        return (
          <span>
            {parts[0]}
            <a 
              href={update.link_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {translatedLinkText}
            </a>
            {parts[1]}
          </span>
        );
      } else {
        // If the split doesn't work as expected, try with translated link text
        const translatedParts = translatedText.split(translatedLinkText);
        if (translatedParts.length === 2) {
          return (
            <span>
              {translatedParts[0]}
              <a 
                href={update.link_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {translatedLinkText}
              </a>
              {translatedParts[1]}
            </span>
          );
        }
      }
    }
    return <span>{translatedText}</span>;
  };

  return (
    <li className="flex items-start gap-2 text-gray-300">
      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
      <span className="text-sm">{renderUpdateText()}</span>
    </li>
  );
};

// Component for translating announcement content
const TranslatedAnnouncement: React.FC<{ announcement: ChangelogAnnouncement }> = ({ announcement }) => {
  const { translatedText: translatedTitle } = useEnhancedTranslation(announcement.title, 'en');
  const { translatedText: translatedSubtitle } = useEnhancedTranslation(announcement.subtitle || '', 'en');

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
        <h3 className="text-xl font-semibold text-gray-100 mb-2">{translatedTitle}</h3>
        {announcement.subtitle && (
          <p className="text-gray-300 mb-4">{translatedSubtitle}</p>
        )}
        
        <ul className="space-y-2">
          {announcement.updates.map(update => (
            <TranslatedUpdate key={update.id} update={update} />
          ))}
        </ul>
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

      // Fetch announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('changelog_announcements')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });

      if (announcementsError) {
        console.error('Error fetching announcements:', announcementsError);
        throw announcementsError;
      }

      console.log('Fetched announcements:', announcementsData);

      // Fetch updates for all announcements
      const { data: updatesData, error: updatesError } = await supabase
        .from('changelog_updates')
        .select('*')
        .order('sort_order', { ascending: true });

      if (updatesError) {
        console.error('Error fetching updates:', updatesError);
        throw updatesError;
      }

      console.log('Fetched updates:', updatesData);

      // Group updates by announcement_id
      const updatesByAnnouncement: Record<string, ChangelogUpdate[]> = {};
      updatesData?.forEach(update => {
        if (!updatesByAnnouncement[update.announcement_id]) {
          updatesByAnnouncement[update.announcement_id] = [];
        }
        updatesByAnnouncement[update.announcement_id].push({
          id: update.id,
          text: update.text,
          link_url: update.link_url || undefined,
          link_text: update.link_text || undefined,
          sort_order: update.sort_order
        });
      });

      // Combine announcements with their updates
      const result: ChangelogAnnouncement[] = announcementsData?.map(announcement => ({
        id: announcement.id,
        date: announcement.date,
        title: announcement.title,
        subtitle: announcement.subtitle || undefined,
        updates: updatesByAnnouncement[announcement.id] || []
      })) || [];

      console.log('Final changelog data:', result);
      return result;
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
