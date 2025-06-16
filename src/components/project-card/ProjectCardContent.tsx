
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Project } from '../../types';
import { UpvoteButton } from './UpvoteButton';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedTranslation } from '@/hooks/useEnhancedTranslation';

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
  };

  return (
    <Card className="bg-[#2D3034] hover:bg-[#292C2F] border border-gray-800 w-full transition-colors cursor-pointer">
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 mb-1 text-gray-100">{translatedTitle}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-6">{translatedDescription}</p>
        
        <div className="mt-2">
          <UpvoteButton 
            upvotes={project.upvotes} 
            userHasUpvoted={project.userHasUpvoted} 
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
