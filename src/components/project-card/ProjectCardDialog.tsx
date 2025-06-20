
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Project, Comment } from '../../types';
import { Separator } from '@/components/ui/separator';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from './StatusBadge';
import { UpvoteButton } from './UpvoteButton';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useEnhancedTranslation } from '@/hooks/useEnhancedTranslation';

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
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Use enhanced translation for better performance
  const { translatedText: translatedTitle } = useEnhancedTranslation(project.title, 'en');
  const { translatedText: translatedDescription } = useEnhancedTranslation(project.description, 'en');

  const handleUpvote = () => {
    onUpvote(project.id);
    toast({
      title: t('upvote.thanks')
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
      title: t('upvote.thanksWithEmail'),
      description: t('upvote.thanksWithEmailSubtitle')
    });
  };

  const handleCommentSubmit = (author: string, content: string) => {
    onAddComment(project.id, {
      author,
      content
    });
    setShowCommentForm(false);
  };

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  return (
    <DialogContent className="sm:max-w-xl bg-[#1a1c23] border border-gray-800 text-gray-200">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge status={project.status} statusUpdatedAt={project.statusUpdatedAt} showUpdatedTime={true} />
        </div>
        <DialogTitle className="text-xl text-gray-100">{translatedTitle}</DialogTitle>
        <DialogDescription className="text-sm text-gray-100">
          {translatedDescription}
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[75vh]">
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
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm text-gray-100">{t('project.comments')} ({project.comments.length})</h4>
            {!showCommentForm && (
              <Button 
                onClick={toggleCommentForm}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 bg-white/10 border-white/10 text-gray-200 hover:bg-white/10"
              >
                <MessageSquare size={16} />
                {t('project.addComment')}
              </Button>
            )}
          </div>
          
          {showCommentForm && (
            <div className="mb-6">
              <CommentForm 
                onSubmit={handleCommentSubmit} 
                onCancel={() => setShowCommentForm(false)} 
              />
            </div>
          )}
          
          <CommentList comments={project.comments} />
        </div>
      </ScrollArea>
    </DialogContent>
  );
};
