
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Comment } from '../../types';

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const { t } = useTranslation();

  return (
    <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-[#242731] p-3 rounded border border-gray-800">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-200">{comment.author}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-300">{comment.content}</p>
        </div>
      ))}
      
      {comments.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">
          {t('project.noComments')}
        </p>
      )}
    </div>
  );
};
