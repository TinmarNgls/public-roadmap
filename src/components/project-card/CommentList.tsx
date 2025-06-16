
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Comment } from '../../types';
import { useEnhancedTranslation } from '@/hooks/useEnhancedTranslation';

interface CommentListProps {
  comments: Comment[];
}

interface TranslatedCommentProps {
  comment: Comment;
}

const TranslatedComment: React.FC<TranslatedCommentProps> = ({ comment }) => {
  const { translatedText: translatedContent } = useEnhancedTranslation(comment.content, 'en');
  
  return (
    <div className="bg-[#242731] p-3 rounded border border-gray-800">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-200">{comment.author}</span>
        <span className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-300">{translatedContent}</p>
    </div>
  );
};

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const { t } = useTranslation();

  return (
    <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
      {comments.map((comment) => (
        <TranslatedComment key={comment.id} comment={comment} />
      ))}
      
      {comments.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">
          {t('project.noComments')}
        </p>
      )}
    </div>
  );
};
