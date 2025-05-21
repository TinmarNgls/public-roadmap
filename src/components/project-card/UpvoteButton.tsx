
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronUp, X } from 'lucide-react';
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
  showEmailInput = false,
  isCard = false,
  onUpvote, 
  onRemoveUpvote,
  onEmailSubmit 
}) => {
  const [email, setEmail] = useState('');
  const [showEmailField, setShowEmailField] = useState(false);
  const isEmailValid = email.includes('@');
  const { toast } = useToast();
  
  // Reset email field state when upvote status changes
  useEffect(() => {
    if (!userHasUpvoted) {
      setShowEmailField(false);
    }
  }, [userHasUpvoted]);

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If already upvoted, remove the upvote
    if (userHasUpvoted && onRemoveUpvote) {
      onRemoveUpvote();
      setShowEmailField(false);
    } else {
      // If not upvoted, show email field
      setShowEmailField(true);
    }
  };
  
  const handleEmailSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Show different toast messages based on whether email was provided
    if (email && onEmailSubmit) {
      // Use onEmailSubmit to handle the email case
      onEmailSubmit(email);
      toast({
        title: "Thanks for upvoting!",
        description: "We'll let you know when this is released 🤗",
      });
    } else {
      // Use regular onUpvote for cases without email
      onUpvote();
      toast({
        title: "Thanks for upvoting! 🚀",
      });
    }
    
    setEmail('');
    setShowEmailField(false);
  };

  const handleCancelEmailInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEmailField(false);
  };

  return (
    <div className={isCard ? "flex flex-col w-full" : "w-full"}>
      {!showEmailField ? (
        <Button
          onClick={handleUpvoteClick}
          variant={userHasUpvoted ? "default" : "outline"}
          size="sm"
          className={`flex items-center gap-1 ${isCard ? 'px-2 py-0 h-7' : ''} 
            ${userHasUpvoted 
              ? 'bg-purple-500 hover:bg-purple-700' 
              : 'hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500'}`}
        >
          <ChevronUp size={isCard ? 14 : 16} className={userHasUpvoted ? "animate-pulse-once" : ""} />
          <span className={isCard ? "text-xs" : ""}>{upvotes}</span>
        </Button>
      ) : (
        <div className="flex flex-col gap-2 mt-1 w-full">
          <p className={`${isCard ? "text-xs" : "text-sm"} font-medium text-gray-300 w-full`}>
            Get notified when released{isCard ? " (optional)" : ""}
          </p>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 w-full">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${isCard ? "h-7 text-xs" : ""} flex-1 bg-[#242731] border-gray-600 text-gray-200 w-full`}
                onClick={(e) => e.stopPropagation()}
                // Remove autoFocus to prevent automatic selection of the email input
              />
              <Button 
                onClick={handleCancelEmailInput}
                size="sm"
                variant="ghost"
                className="px-1"
              >
                <X size={16} />
              </Button>
            </div>
            <Button 
              onClick={handleEmailSubmit}
              disabled={email !== '' && !isEmailValid}
              size="sm"
              className={`w-full bg-purple-500 hover:bg-purple-700 text-white ${isCard ? "h-7 text-xs" : ""}`}
            >
              Upvote
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
