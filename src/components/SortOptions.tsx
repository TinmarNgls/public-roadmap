
import React from 'react';
import { Button } from '@/components/ui/button';
import { SortAsc, SortDesc } from 'lucide-react';

type SortOption = 'upvotes' | 'newest';
type SortDirection = 'asc' | 'desc';

interface SortOptionsProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortOption) => void;
  onDirectionChange: (direction: SortDirection) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortBy,
  sortDirection,
  onSortChange,
  onDirectionChange,
}) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm text-gray-500 mr-2">Sort by:</span>
      <Button
        variant={sortBy === 'upvotes' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSortChange('upvotes')}
      >
        Upvotes
      </Button>
      <Button
        variant={sortBy === 'newest' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSortChange('newest')}
      >
        Newest
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
        className="ml-2"
      >
        {sortDirection === 'asc' ? (
          <SortAsc size={16} />
        ) : (
          <SortDesc size={16} />
        )}
      </Button>
    </div>
  );
};

export default SortOptions;
