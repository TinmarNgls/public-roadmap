
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (name: string, comment: string) => void;
  onCancel?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && comment.trim()) {
      onSubmit(name, comment);
      setName('');
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="space-y-3">
        <Input 
          placeholder={t('modal.comment.authorPlaceholder')} 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#242731] border-gray-700 text-gray-200"
        />
        <Textarea 
          placeholder={t('modal.comment.contentPlaceholder')} 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="h-20 bg-[#242731] border-gray-700 text-gray-200"
        />
        <div className="flex space-x-2">
          {onCancel && (
            <Button 
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 bg-white/10 border-white/10 text-gray-200 hover:bg-white/10"
            >
              {t('modal.comment.cancel')}
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={!name.trim() || !comment.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-[#7D55CA] hover:bg-[#A581E0]"
          >
            <SendHorizontal size={16} />
            {t('modal.comment.submit')}
          </Button>
        </div>
      </div>
    </form>
  );
};
