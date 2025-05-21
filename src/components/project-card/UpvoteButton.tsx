
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

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

  const handleSkipEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote();
    setShowEmailField(false);
  };
  
  const handleEmailSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote();
    if (onEmailSubmit && email) {
      onEmailSubmit(email);
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
          <p className={`${isCard ? "text-xs" : "text-sm"} font-medium text-white bg-gray-700 px-2 py-1 rounded-t-md mt-2 border-t border-x border-gray-600 w-full text-center`}>
            Get notified when released{isCard ? "" : " (optional)"}
          </p>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1 w-full">
              <Input
                type="email"
                placeholder="Your email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${isCard ? "h-7 text-xs" : ""} flex-1 bg-[#242731] border-gray-600 text-gray-200 w-full`}
                onClick={(e) => e.stopPropagation()}
                autoFocus
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
            <div className="flex gap-2 w-full">
              <Button 
                onClick={handleSkipEmail}
                size="sm"
                className={`flex-1 bg-[#2a2d36] text-gray-300 hover:bg-gray-700 ${isCard ? "h-7 text-xs" : ""}`}
              >
                Skip
              </Button>
              <Button 
                onClick={handleEmailSubmit}
                disabled={email !== '' && !isEmailValid}
                size="sm"
                className={`flex-1 bg-purple-500 hover:bg-purple-700 text-white ${isCard ? "h-7 text-xs" : ""}`}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
