
import React from 'react';
import { useChangelogData } from '@/hooks/useChangelogData';
import ChangelogTimeline from './changelog/ChangelogTimeline';

const ChangelogDisplay: React.FC = () => {
  const { data: announcements = [], isLoading } = useChangelogData();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Loading changelog...</div>
        </div>
      </div>
    );
  }

  return <ChangelogTimeline announcements={announcements} />;
};

export default ChangelogDisplay;
