
import React from 'react';
import { Card } from '@/components/ui/card';
import { Project } from '../../types';
import { UpvoteButton } from './UpvoteButton';

interface ProjectCardContentProps {
  project: Project;
  onUpvote: (id: string, email?: string) => void;
}

export const ProjectCardContent: React.FC<ProjectCardContentProps> = ({ 
  project,
  onUpvote
}) => {
  const [showEmailInput, setShowEmailInput] = React.useState(false);
  
  React.useEffect(() => {
    if (!project.userHasUpvoted) {
      setShowEmailInput(false);
    }
  }, [project.userHasUpvoted]);
  
  const handleUpvote = () => {
    // Process the upvote first
    onUpvote(project.id);
    
    // Show email input only after upvoting (if not already shown)
    if (project.userHasUpvoted === false) {
      setShowEmailInput(true);
    }
  };
  
  const handleEmailSubmit = (email: string) => {
    onUpvote(project.id, email);
    setShowEmailInput(false);
  };

  return (
    <Card className="bg-white w-full hover:shadow-md transition-shadow cursor-pointer">
      <div className="p-4">
        <h3 className="text-sm font-medium line-clamp-2 mb-1">{project.title}</h3>
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{project.description}</p>
        
        <div className="flex flex-col items-end mt-2">
          <UpvoteButton 
            upvotes={project.upvotes}
            userHasUpvoted={project.userHasUpvoted}
            showEmailInput={showEmailInput}
            isCard={true}
            onUpvote={handleUpvote}
            onEmailSubmit={handleEmailSubmit}
          />
        </div>
      </div>
    </Card>
  );
};
