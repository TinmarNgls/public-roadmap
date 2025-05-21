
import React from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Wrench, Eye, Archive } from 'lucide-react';

type FilterOption = 'all' | 'released' | 'ongoing' | 'next_up' | 'submitted';

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
        variant={activeFilter === 'next_up' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('next_up')}
        className={activeFilter === 'next_up' ? 'bg-purple-500 hover:bg-purple-600' : ''}
      >
        <Eye size={16} className="mr-1" />
        Next Up
      </Button>
      <Button
        variant={activeFilter === 'submitted' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('submitted')}
        className={activeFilter === 'submitted' ? 'bg-gray-500 hover:bg-gray-600' : ''}
      >
        <Archive size={16} className="mr-1" />
        Submitted
      </Button>
    </div>
  );
};

export default StatusFilter;
