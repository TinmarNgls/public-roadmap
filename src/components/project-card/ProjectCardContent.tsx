
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Project } from '../../types';
import { UpvoteButton } from './UpvoteButton';

interface ProjectCardContentProps {
  project: Project;
  onUpvote: (id: string, email?: string) => void;
  onRemoveUpvote?: (id: string) => void;
}

export const ProjectCardContent: React.FC<ProjectCardContentProps> = ({ 
  project,
  onUpvote,
  onRemoveUpvote
}) => {
  const [showEmailInput, setShowEmailInput] = useState(false);
  
  // When upvote status changes, update UI accordingly
  useEffect(() => {
    if (!project.userHasUpvoted) {
      setShowEmailInput(false);
    }
  }, [project.userHasUpvoted]);
  
  const handleUpvote = () => {
    // Only process upvote if user hasn't upvoted yet
    if (!project.userHasUpvoted) {
      onUpvote(project.id);
      // Show email input after upvoting
      setShowEmailInput(true);
    }
  };

  const handleRemoveUpvote = () => {
    // Only process remove upvote if user has upvoted
    if (project.userHasUpvoted && onRemoveUpvote) {
      onRemoveUpvote(project.id);
      setShowEmailInput(false);
    }
  };
  
  const handleEmailSubmit = (email: string) => {
    onUpvote(project.id, email);
    setShowEmailInput(false);
  };

  return (
    <Card className="bg-[#222530] hover:bg-[#272a33] border border-gray-800 w-full transition-colors cursor-pointer">
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 mb-1 text-gray-100">{project.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{project.description}</p>
        
        <div className="flex flex-col items-end mt-2">
          <UpvoteButton 
            upvotes={project.upvotes}
            userHasUpvoted={project.userHasUpvoted}
            showEmailInput={showEmailInput}
            isCard={true}
            onUpvote={handleUpvote}
            onRemoveUpvote={handleRemoveUpvote}
            onEmailSubmit={handleEmailSubmit}
          />
        </div>
      </div>
    </Card>
  );
};
