
import React from 'react';
import { Comment } from '../../types';

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
      {comments.map((comment) => (
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
      
      {comments.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};
