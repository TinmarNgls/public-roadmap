
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center my-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search ideas..."
          className="pl-8 bg-[#383b3e] border-gray-800 text-gray-200 placeholder:9b9d9e"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <Button 
        onClick={onNewIdeaClick} 
        className="bg-[#7D55CA] hover:bg-[#A581E0] text-white"
      >
        <Plus className="mr-1 h-4 w-4" />
        Submit a new idea
      </Button>
    </div>
  );
};

export default ProjectSearch;
