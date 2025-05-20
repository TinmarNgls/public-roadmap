
import React from 'react';
import { Button } from '@/components/ui/button';

type FilterOption = 'all' | 'in-progress' | 'planned' | 'consideration';

interface StatusFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('all')}
      >
        All
      </Button>
      <Button
        variant={activeFilter === 'in-progress' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('in-progress')}
        className={activeFilter === 'in-progress' ? 'bg-blue-500 hover:bg-blue-600' : ''}
      >
        In Progress
      </Button>
      <Button
        variant={activeFilter === 'planned' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('planned')}
        className={activeFilter === 'planned' ? 'bg-orange-500 hover:bg-orange-600' : ''}
      >
        Planned
      </Button>
      <Button
        variant={activeFilter === 'consideration' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('consideration')}
        className={activeFilter === 'consideration' ? 'bg-gray-500 hover:bg-gray-600' : ''}
      >
        Under Consideration
      </Button>
    </div>
  );
};

export default StatusFilter;
