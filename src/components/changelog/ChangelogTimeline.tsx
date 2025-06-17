
import React from 'react';
import ChangelogAnnouncement from './ChangelogAnnouncement';

interface ChangelogTimelineProps {
  announcements: Array<{
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
  }>;
}

const ChangelogTimeline: React.FC<ChangelogTimelineProps> = ({ announcements }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-0">
      <div className="space-y-8 lg:space-y-12">
        {announcements.map((announcement, index) => (
          <div key={announcement.id}>
            <ChangelogAnnouncement announcement={announcement} />
            {index < announcements.length - 1 && (
              <div className="mt-8 lg:mt-12 border-b border-gray-700"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangelogTimeline;
