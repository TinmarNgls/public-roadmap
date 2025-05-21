
import React, { useState, useEffect } from 'react';
import { Comment, Project } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronUp, MessageCircle, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  
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
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'ongoing':
        return 'bg-blue-500 text-white';
      case 'released':
        return 'bg-green-500 text-white';
      case 'consideration':
        return 'bg-purple-500 text-white';
      case 'backlog':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'ongoing':
        return 'Ongoing';
      case 'released':
        return 'Released';
      case 'consideration':
        return 'Under Consideration';
      case 'backlog':
        return 'Backlog';
      default:
        return status;
    }
  };

  const handleUpvote = () => {
    // If user already upvoted or email is provided, process the upvote
    if (project.userHasUpvoted || email) {
      onUpvote(project.id, email);
      setShowEmailInput(false);
      setEmail('');
    } else {
      // Show email input instead of upvoting immediately
      setShowEmailInput(true);
    }
  };

  const handleEmailSubmit = () => {
    // Update with email notification
    onUpvote(project.id, email);
    setShowEmailInput(false);
    setEmail('');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && author.trim()) {
      onAddComment(project.id, {
        author,
        content: comment
      });
      setComment('');
      setAuthor('');
    }
  };

  // Format submission date
  const submittedAt = project.submittedAt 
    ? new Date(project.submittedAt).toLocaleDateString()
    : "May 2025"; // Fallback for existing data

  // Check if email contains @ for validation
  const isEmailValid = email.includes('@');

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Card className="bg-white w-full hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-4">
            <h3 className="text-sm font-medium line-clamp-2 mb-1">{project.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-2 mb-3">{project.description}</p>
            
            <div className="flex flex-col items-end mt-2">
              {/* Show email input before upvoting on the card view */}
              {showEmailInput && !project.userHasUpvoted && (
                <div className="w-full mb-2 flex flex-col gap-2">
                  <p className="text-xs text-gray-600">Get notified when released:</p>
                  <div className="flex gap-1">
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-7 text-xs flex-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmailSubmit();
                      }}
                      disabled={!isEmailValid}
                      size="sm"
                      className="bg-white text-black border border-black hover:bg-gray-100 h-7 px-2 py-0"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpvote();
                }}
                variant={project.userHasUpvoted ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-1 px-2 py-0 h-7 ${project.userHasUpvoted ? "" : "hover:bg-primary/10 hover:text-primary"}`}
              >
                <ChevronUp size={14} className={project.userHasUpvoted ? "animate-pulse-once" : ""} />
                <span className="text-xs">{project.upvotes}</span>
              </Button>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClass(project.status)}`}>
              {getStatusText(project.status)}
            </span>
          </div>
          <DialogTitle className="text-xl">{project.title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {project.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col text-sm text-gray-500 mt-2 mb-4">
          <div>Submitted at: {submittedAt}</div>
          <div>Submitted by: {project.submittedBy || "Shotgun Team"}</div>
        </div>
        
        <div className="mb-4">
          <Button
            onClick={handleUpvote}
            variant={project.userHasUpvoted ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
          >
            <ChevronUp size={16} className={project.userHasUpvoted ? "animate-pulse-once" : ""} />
            <span>{project.upvotes} upvotes</span>
          </Button>
          
          {/* Only show email input after user has upvoted AND we're showing the email input */}
          {project.userHasUpvoted && showEmailInput && (
            <div className="flex flex-col gap-3 mt-3">
              <p className="text-sm">Get notified when this feature is released (optional)</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleEmailSubmit} 
                  disabled={!isEmailValid}
                  className="bg-white text-black border border-black hover:bg-gray-100"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <Separator className="my-2" />
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Comments ({project.comments.length})</h4>
          
          <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
            {project.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{comment.author}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
            
            {project.comments.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-2">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
          
          <form onSubmit={handleSubmitComment} className="mt-4">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                placeholder="Your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                rows={3}
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                Post Comment
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCard;
