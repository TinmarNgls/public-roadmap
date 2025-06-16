
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';

interface StatusBadgeProps {
  status: string;
  statusUpdatedAt?: string;
  showUpdatedTime?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, statusUpdatedAt, showUpdatedTime = false }) => {
  const { t } = useTranslation();

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
    return t(`status.${status}`);
  };

  // Format the status updated time if available
  const formattedTime = statusUpdatedAt && showUpdatedTime
    ? format(parseISO(statusUpdatedAt), 'MMM d, yyyy')
    : null;

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClass(status)}`}>
        {getStatusText(status)}
      </span>
      {formattedTime && (
        <span className="text-xs text-gray-400">since {formattedTime}</span>
      )}
    </div>
  );
};
