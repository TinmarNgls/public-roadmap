
import React from 'react';
import ChangelogAnnouncement from './ChangelogAnnouncement';

interface ChangelogTimelineProps {
  announcements: Array<{
    id: string;
    date: string;
    title: string;
    content: string;
  }>;
}

const ChangelogTimeline: React.FC<ChangelogTimelineProps> = ({ announcements }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-48 top-0 bottom-0 w-0.5 bg-gray-700"></div>
        
        <div className="space-y-8">
          {announcements.map((announcement) => (
            <ChangelogAnnouncement key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangelogTimeline;
