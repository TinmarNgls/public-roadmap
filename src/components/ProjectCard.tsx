
import React, { useState, useEffect } from 'react';
import { Comment, Project } from '../types';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProjectCardContent } from './project-card/ProjectCardContent';
import { ProjectCardDialog } from './project-card/ProjectCardDialog';

interface ProjectCardProps {
  project: Project;
  onUpvote: (id: string, email?: string) => void;
  onAddComment: (id: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  isFocused?: boolean;
  onDialogClose?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onUpvote,
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
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <div>
          <ProjectCardContent 
            project={project} 
            onUpvote={onUpvote} 
          />
        </div>
      </DialogTrigger>
      
      <ProjectCardDialog
        project={project}
        onUpvote={onUpvote}
        onAddComment={onAddComment}
      />
    </Dialog>
  );
};

export default ProjectCard;

