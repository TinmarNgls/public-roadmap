
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'ongoing':
        return 'bg-blue-500 text-white';
      case 'released':
        return 'bg-green-500 text-white';
      case 'consideration':
        return 'bg-purple-500 text-white';
      case 'backlog':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'ongoing':
        return 'Ongoing';
      case 'released':
        return 'Released';
      case 'consideration':
        return 'Under Consideration';
      case 'backlog':
        return 'Backlog';
      default:
        return status;
    }
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClass(status)}`}>
      {getStatusText(status)}
    </span>
  );
};
