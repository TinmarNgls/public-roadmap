
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UpvoteButtonProps {
  upvotes: number;
  userHasUpvoted: boolean | undefined;
  showEmailInput?: boolean;
  isCard?: boolean;
  onUpvote: () => void;
  onRemoveUpvote?: () => void;
  onEmailSubmit?: (email: string) => void;
}

export const UpvoteButton: React.FC<UpvoteButtonProps> = ({ 
  upvotes, 
  userHasUpvoted, 
  isCard = false,
  onUpvote, 
  onRemoveUpvote,
  onEmailSubmit 
}) => {
  const [email, setEmail] = useState('');
  const [showEmailField, setShowEmailField] = useState(false);
  const isEmailValid = email.trim() !== '';
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Reset email field state when upvote status changes
  useEffect(() => {
    if (!userHasUpvoted) {
      setShowEmailField(false);
    }
  }, [userHasUpvoted]);

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent the default action which could trigger the card click
    
    // If already upvoted, remove the upvote
    if (userHasUpvoted && onRemoveUpvote) {
      onRemoveUpvote();
      setShowEmailField(false);
      
      toast({
        title: "Upvote removed",
      });
    } else {
      // If not upvoted, show email field
      setShowEmailField(true);
    }
  };
  
  const handleEmailSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent the default action
    
    if (email && onEmailSubmit) {
      // Use onEmailSubmit to handle the email case
      onEmailSubmit(email);
      toast({
        title: "Thanks for upvoting!",
        description: "We'll let you know when this is released 🤗",
      });
    }
    
    setEmail('');
    setShowEmailField(false);
  };

  const handleCancelEmailInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent the default action
    setShowEmailField(false);
  };
  
  return (
    <div className={isCard ? "flex" : "w-full"}>
      {!showEmailField ? (
        <Button
          onClick={handleUpvoteClick}
          variant="outline"
          size="sm"
          className={`flex items-center gap-1 ${isCard ? 'px-2 py-0 h-7' : ''} 
            ${userHasUpvoted 
              ? 'bg-white/10 border-white/10 hover:bg-white/10' 
              : 'bg-white/10 hover:bg-white/10 border-white/10'}`}
        >
          <ThumbsUp 
            size={isCard ? 14 : 16} 
            className={userHasUpvoted ? "animate-pulse-once" : ""}
            fill={userHasUpvoted ? "#7d55ca" : "none"}
            color={userHasUpvoted ? "#7d55ca" : "currentColor"}
          />
          <span className={isCard ? "text-xs" : ""}>{upvotes} votes</span>
        </Button>
      ) : (
        <div className="flex flex-col gap-2 mt-1 w-full" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col gap-2 w-full">
            <Input
              type="email"
              placeholder={t('upvote.organiserPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${isCard ? "h-7 text-xs" : ""} bg-[#252830] border-gray-700 text-gray-200 placeholder:text-gray-500`}
              onClick={(e) => e.stopPropagation()}
              required
            />
            <div className="flex gap-2 w-full">
              <Button 
                onClick={handleCancelEmailInput}
                size="sm"
                variant="outline"
                className={`${isCard ? "h-7 text-xs" : ""} flex-1 bg-white/10 border-white/10 text-gray-200 hover:bg-white/10`}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEmailSubmit}
                disabled={!isEmailValid}
                size="sm"
                className={`flex-1 bg-[#7D55CA] hover:bg-[#A581E0] text-white ${isCard ? "h-7 text-xs" : ""}`}
              >
                Upvote
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
