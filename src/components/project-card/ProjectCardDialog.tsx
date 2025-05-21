
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
import { useToast } from '@/hooks/use-toast';

interface ProjectCardDialogProps {
  project: Project;
  onUpvote: (id: string, email?: string) => void;
  onRemoveUpvote?: (id: string) => void;
  onAddComment: (id: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

export const ProjectCardDialog: React.FC<ProjectCardDialogProps> = ({
  project,
  onUpvote,
  onRemoveUpvote,
  onAddComment
}) => {
  const { toast } = useToast();
  
  const handleUpvote = () => {
    onUpvote(project.id);
    toast({
      title: "Thanks for upvoting! 🚀",
    });
  };
  
  const handleRemoveUpvote = () => {
    if (onRemoveUpvote) {
      onRemoveUpvote(project.id);
    }
  };
  
  const handleEmailSubmit = (email: string) => {
    onUpvote(project.id, email);
    toast({
      title: "Thanks for upvoting!",
      description: "We'll let you know when this is released 🤗",
    });
  };

  const handleCommentSubmit = (author: string, content: string) => {
    onAddComment(project.id, { author, content });
  };
  
  // Format submission date
  const submittedAt = project.submittedAt 
    ? new Date(project.submittedAt).toLocaleDateString()
    : "May 2025"; // Fallback for existing data

  return (
    <DialogContent className="sm:max-w-xl bg-[#1a1c23] border border-gray-800 text-gray-200">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge status={project.status} />
        </div>
        <DialogTitle className="text-xl text-gray-100">{project.title}</DialogTitle>
        <DialogDescription className="text-sm text-gray-100">
          {project.description}
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[75vh]">
        <div className="flex flex-col text-sm text-gray-400 mt-2 mb-4">
          <div>Submitted at: {submittedAt}</div>
          <div>Submitted by: {project.submittedBy || "Shotgun Team"}</div>
        </div>
        
        <div className="mb-4">
          <UpvoteButton
            upvotes={project.upvotes}
            userHasUpvoted={project.userHasUpvoted}
            onUpvote={handleUpvote}
            onRemoveUpvote={handleRemoveUpvote}
            onEmailSubmit={handleEmailSubmit}
          />
        </div>
        
        <Separator className="my-2 bg-gray-800" />
        
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-gray-300">Comments ({project.comments.length})</h4>
          
          <CommentList comments={project.comments} />
          
          <CommentForm onSubmit={handleCommentSubmit} />
        </div>
      </ScrollArea>
    </DialogContent>
  );
};
