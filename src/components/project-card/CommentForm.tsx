
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CommentFormProps {
  onSubmit: (author: string, content: string) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && author.trim()) {
      onSubmit(author, comment);
      setComment('');
      setAuthor('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h4 className="font-medium mb-2 text-gray-200">Add a comment</h4>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Your name or organisation"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1e2029] text-gray-200 placeholder:text-gray-500"
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          placeholder="Your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded text-sm bg-[#1e2029] text-gray-200 placeholder:text-gray-500"
          rows={3}
          required
        ></textarea>
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          size="sm"
          className="bg-purple-500 hover:bg-purple-600"
        >
          Post Comment
        </Button>
      </div>
    </form>
  );
};
