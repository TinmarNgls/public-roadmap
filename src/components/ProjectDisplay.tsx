
import React from 'react';
import { Project, Comment } from '../types';
import KanbanBoard from '@/components/KanbanBoard';
import { MessageCircle } from 'lucide-react';

interface ProjectDisplayProps {
  isLoading: boolean;
  filteredProjects: Project[];
  onUpvote: (id: string, email?: string) => void;
  onRemoveUpvote: (id: string) => void;
  onAddComment: (id: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  focusProjectId: string | null;
  clearFocusProjectId: () => void;
}

const ProjectDisplay: React.FC<ProjectDisplayProps> = ({
  isLoading,
  filteredProjects,
  onUpvote,
  onRemoveUpvote,
  onAddComment,
  focusProjectId,
  clearFocusProjectId
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-300">Loading ideas...</p>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1a1c23] rounded-lg shadow border border-gray-800">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-300">No projects found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <KanbanBoard 
      projects={filteredProjects} 
      onUpvote={onUpvote}
      onRemoveUpvote={onRemoveUpvote}
      onAddComment={onAddComment}
      focusProjectId={focusProjectId}
      clearFocusProjectId={clearFocusProjectId}
    />
  );
};

export default ProjectDisplay;
