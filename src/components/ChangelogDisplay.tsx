import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle, Zap, Bug, Plus } from 'lucide-react';
interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  type: 'feature' | 'improvement' | 'bugfix';
  items: string[];
}
const mockChangelogData: ChangelogEntry[] = [{
  id: '1',
  version: '2.1.0',
  date: '2024-06-15',
  title: 'Enhanced User Experience',
  description: 'Major improvements to the user interface and new features',
  type: 'feature',
  items: ['Added multi-language support for French and Portuguese', 'Improved mobile responsiveness across all screens', 'New upvoting system with email notifications', 'Enhanced project search functionality']
}, {
  id: '2',
  version: '2.0.1',
  date: '2024-06-10',
  title: 'Bug Fixes and Performance',
  description: 'Critical bug fixes and performance improvements',
  type: 'bugfix',
  items: ['Fixed issue with comment submission', 'Improved loading times for project cards', 'Fixed responsive layout issues on tablets', 'Resolved translation loading errors']
}, {
  id: '3',
  version: '2.0.0',
  date: '2024-06-01',
  title: 'Major Platform Update',
  description: 'Complete redesign with new features and improved architecture',
  type: 'feature',
  items: ['Complete UI redesign with dark theme', 'New kanban board layout for project status', 'Added comment system for projects', 'Implemented real-time updates', 'New project submission workflow']
}, {
  id: '4',
  version: '1.2.3',
  date: '2024-05-20',
  title: 'Minor Improvements',
  description: 'Small enhancements and bug fixes',
  type: 'improvement',
  items: ['Updated project status badges', 'Improved error handling', 'Enhanced accessibility features', 'Performance optimizations']
}];
const ChangelogDisplay: React.FC = () => {
  const { t } = useTranslation();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'improvement':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'bugfix':
        return <Bug className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'feature':
        return 'New Feature';
      case 'improvement':
        return 'Improvement';
      case 'bugfix':
        return 'Bug Fix';
      default:
        return 'Update';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-48 top-0 bottom-0 w-0.5 bg-gray-700"></div>
        
        <div className="space-y-8">
          {mockChangelogData.map((entry, index) => (
            <div key={entry.id} className="relative flex items-start">
              {/* Date on the left */}
              <div className="w-44 flex-shrink-0 text-right pr-6">
                <span className="text-gray-400 text-sm font-medium">
                  {formatDate(entry.date)}
                </span>
              </div>
              
              {/* Timeline dot */}
              <div className="absolute left-[11.75rem] w-4 h-4 bg-[#7D55CA] rounded-full border-4 border-[#222529] z-10"></div>
              
              {/* Content */}
              <div className="ml-8 bg-[#383b3e] rounded-lg p-6 border border-gray-700 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(entry.type)}
                    <span className="text-sm font-medium text-gray-300 bg-gray-800 px-2 py-1 rounded">
                      v{entry.version}
                    </span>
                    <span className="text-sm text-gray-400">
                      {getTypeLabel(entry.type)}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-100 mb-2">{entry.title}</h3>
                <p className="text-gray-300 mb-4">{entry.description}</p>
                
                <ul className="space-y-2">
                  {entry.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangelogDisplay;
