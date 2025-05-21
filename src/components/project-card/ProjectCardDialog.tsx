
import React, { useState, useEffect } from 'react';
import { Project, Comment } from '../../types';
import { Separator } from '@/components/ui/separator';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from './StatusBadge';
import { UpvoteButton } from './UpvoteButton';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectCardDialogProps {
  project: Project;
  onUpvote: (id: string, email?: string) => void;
  onAddComment: (id: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

export const ProjectCardDialog: React.FC<ProjectCardDialogProps> = ({
  project,
  onUpvote,
  onAddComment
}) => {
  const [showEmailInput, setShowEmailInput] = useState(false);
  
  // Update the UI state when upvote status changes
  useEffect(() => {
    if (!project.userHasUpvoted) {
      setShowEmailInput(false);
    }
  }, [project.userHasUpvoted]);

  const handleUpvote = () => {
    // Only process upvote if user hasn't upvoted yet
    if (!project.userHasUpvoted) {
      onUpvote(project.id);
      setShowEmailInput(true);
    }
  };
  
  const handleEmailSubmit = (email: string) => {
    onUpvote(project.id, email);
    setShowEmailInput(false);
  };

  const handleCommentSubmit = (author: string, content: string) => {
    onAddComment(project.id, { author, content });
  };
  
  // Format submission date
  const submittedAt = project.submittedAt 
    ? new Date(project.submittedAt).toLocaleDateString()
    : "May 2025"; // Fallback for existing data

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge status={project.status} />
        </div>
        <DialogTitle className="text-xl">{project.title}</DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          {project.description}
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[75vh]">
        <div className="flex flex-col text-sm text-gray-500 mt-2 mb-4">
          <div>Submitted at: {submittedAt}</div>
          <div>Submitted by: {project.submittedBy || "Shotgun Team"}</div>
        </div>
        
        <div className="mb-4">
          <UpvoteButton
            upvotes={project.upvotes}
            userHasUpvoted={project.userHasUpvoted}
            showEmailInput={showEmailInput}
            onUpvote={handleUpvote}
            onEmailSubmit={handleEmailSubmit}
          />
        </div>
        
        <Separator className="my-2" />
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Comments ({project.comments.length})</h4>
          
          <CommentList comments={project.comments} />
          
          <CommentForm onSubmit={handleCommentSubmit} />
        </div>
      </ScrollArea>
    </DialogContent>
  );
};
