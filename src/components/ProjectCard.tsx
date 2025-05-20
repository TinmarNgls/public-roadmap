
import React, { useState } from 'react';
import { Comment, Project } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ProjectCardProps {
  project: Project;
  onUpvote: (id: string) => void;
  onAddComment: (id: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onUpvote,
  onAddComment
}) => {
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  
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
    onUpvote(project.id);
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

  return (
    <Card className="bg-white w-full hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="text-sm font-medium line-clamp-2 mb-1">{project.title}</h3>
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{project.description}</p>
        
        <div className="flex items-center justify-between mt-2">
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClass(project.status)}`}>
            {getStatusText(project.status)}
          </span>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleUpvote}
              variant={project.userHasUpvoted ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-1 px-2 py-0 h-7 ${project.userHasUpvoted ? "" : "hover:bg-primary/10 hover:text-primary"}`}
            >
              <ThumbsUp size={14} className={project.userHasUpvoted ? "animate-pulse-once" : ""} />
              <span className="text-xs">{project.upvotes}</span>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 px-2 py-0 h-7"
                >
                  <MessageCircle size={14} />
                  <span className="text-xs">{project.comments.length}</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{project.title}</SheetTitle>
                  <SheetDescription>
                    {project.description}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium">Comments ({project.comments.length})</h4>
                  </div>
                  
                  <form onSubmit={handleSubmitComment} className="mb-4">
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
                  
                  <Separator className="my-4" />
                  
                  {project.comments.map((comment) => (
                    <div key={comment.id} className="mb-3 bg-gray-50 p-3 rounded">
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
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
