
import React, { useState } from 'react';
import { Comment, Project } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp } from 'lucide-react';

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
  const [isCommenting, setIsCommenting] = useState(false);

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'in-progress':
        return 'status-in-progress';
      case 'planned':
        return 'status-planned';
      case 'consideration':
        return 'status-consideration';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'in-progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
      case 'consideration':
        return 'Under Consideration';
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
      setIsCommenting(false);
    }
  };

  return (
    <Card className="w-full mb-6">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{project.title}</h3>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusClass(project.status)}`}>
              {getStatusText(project.status)}
            </span>
          </div>
          <Button
            onClick={handleUpvote}
            variant={project.userHasUpvoted ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-1 ${project.userHasUpvoted ? "" : "hover:bg-primary/10 hover:text-primary"}`}
          >
            <ThumbsUp size={16} className={project.userHasUpvoted ? "animate-pulse-once" : ""} />
            <span>{project.upvotes}</span>
          </Button>
        </div>
        
        <p className="mt-4 text-sm text-gray-600">{project.description}</p>
        
        <Separator className="my-4" />
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Comments ({project.comments.length})</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsCommenting(!isCommenting)}
            >
              {isCommenting ? 'Cancel' : 'Add Comment'}
            </Button>
          </div>
          
          {isCommenting && (
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
          )}
          
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
          
          {project.comments.length === 0 && !isCommenting && (
            <p className="text-sm text-gray-400 text-center py-2">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
