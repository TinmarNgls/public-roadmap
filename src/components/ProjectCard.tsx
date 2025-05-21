
import React, { useState, useEffect } from 'react';
import { Comment, Project } from '../types';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProjectCardContent } from './project-card/ProjectCardContent';
import { ProjectCardDialog } from './project-card/ProjectCardDialog';

interface ProjectCardProps {
  project: Project;
  onUpvote: (id: string, email?: string) => void;
  onRemoveUpvote?: (id: string) => void;
  onAddComment: (id: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  isFocused?: boolean;
  onDialogClose?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onUpvote,
  onRemoveUpvote,
  onAddComment,
  isFocused = false,
  onDialogClose
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Open the dialog if the card is focused
  useEffect(() => {
    if (isFocused) {
      setIsDialogOpen(true);
    }
  }, [isFocused]);

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && onDialogClose) {
      onDialogClose();
    }
  };

  return (
    // Add tabIndex="-1" to prevent dialog trigger from being focusable
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <div tabIndex={-1}>
          <ProjectCardContent 
            project={project} 
            onUpvote={onUpvote}
            onRemoveUpvote={onRemoveUpvote}
          />
        </div>
      </DialogTrigger>
      
      <ProjectCardDialog
        project={project}
        onUpvote={onUpvote}
        onRemoveUpvote={onRemoveUpvote}
        onAddComment={onAddComment}
      />
    </Dialog>
  );
};

export default ProjectCard;
