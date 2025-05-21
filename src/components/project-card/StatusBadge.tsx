
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'ongoing':
        return 'bg-blue-600 text-white';
      case 'released':
        return 'bg-green-600 text-white';
      case 'next_up':
        return 'bg-purple-600 text-white';
      case 'submitted':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'ongoing':
        return 'Ongoing';
      case 'released':
        return 'Released';
      case 'next_up':
        return 'Next Up';
      case 'submitted':
        return 'Submitted';
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
