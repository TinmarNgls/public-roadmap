
import React from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Wrench, Brain, Pencil } from 'lucide-react';

type FilterOption = 'all' | 'released' | 'ongoing' | 'consideration' | 'backlog';

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
        variant={activeFilter === 'released' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('released')}
        className={activeFilter === 'released' ? 'bg-green-500 hover:bg-green-600' : ''}
      >
        <Rocket size={16} className="mr-1" />
        Released
      </Button>
      <Button
        variant={activeFilter === 'ongoing' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('ongoing')}
        className={activeFilter === 'ongoing' ? 'bg-blue-500 hover:bg-blue-600' : ''}
      >
        <Wrench size={16} className="mr-1" />
        Ongoing
      </Button>
      <Button
        variant={activeFilter === 'consideration' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('consideration')}
        className={activeFilter === 'consideration' ? 'bg-purple-500 hover:bg-purple-600' : ''}
      >
        <Brain size={16} className="mr-1" />
        Consideration
      </Button>
      <Button
        variant={activeFilter === 'backlog' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('backlog')}
        className={activeFilter === 'backlog' ? 'bg-gray-500 hover:bg-gray-600' : ''}
      >
        <Pencil size={16} className="mr-1" />
        Backlog
      </Button>
    </div>
  );
};

export default StatusFilter;
