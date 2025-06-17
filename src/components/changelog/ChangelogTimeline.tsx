
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
