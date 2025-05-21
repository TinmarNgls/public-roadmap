
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ProjectSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewIdeaClick: () => void;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onNewIdeaClick 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start mb-6 justify-between">
      <Input
        type="search"
        placeholder="Search features or ideas..."
        value={searchQuery}
        onChange={onSearchChange}
        className="max-w-md bg-[#1a1c23] border-gray-700 text-gray-200 placeholder:text-gray-500"
      />
      <Button 
        onClick={onNewIdeaClick}
        className="flex-shrink-0 bg-purple-600 hover:bg-purple-700"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Submit a new idea
      </Button>
    </div>
  );
};

export default ProjectSearch;
