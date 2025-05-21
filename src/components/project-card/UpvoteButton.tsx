
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronUp } from 'lucide-react';

interface UpvoteButtonProps {
  upvotes: number;
  userHasUpvoted: boolean | undefined;
  showEmailInput?: boolean;
  isCard?: boolean;
  onUpvote: () => void;
  onEmailSubmit?: (email: string) => void;
}

export const UpvoteButton: React.FC<UpvoteButtonProps> = ({ 
  upvotes, 
  userHasUpvoted, 
  showEmailInput = false,
  isCard = false,
  onUpvote, 
  onEmailSubmit 
}) => {
  const [email, setEmail] = useState('');
  const [showEmailField, setShowEmailField] = useState(false);
  const isEmailValid = email.includes('@');
  
  // Show email field after upvoting
  useEffect(() => {
    if (userHasUpvoted) {
      setShowEmailField(showEmailInput);
    }
  }, [userHasUpvoted, showEmailInput]);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only allow upvote if user hasn't already upvoted
    if (!userHasUpvoted) {
      onUpvote();
      setShowEmailField(true);
    }
  };
  
  const handleEmailSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEmailSubmit && isEmailValid) {
      onEmailSubmit(email);
      setEmail('');
      setShowEmailField(false);
    }
  };

  return (
    <div className={isCard ? "flex flex-col items-end" : ""}>
      <Button
        onClick={handleUpvote}
        variant={userHasUpvoted ? "default" : "outline"}
        size="sm"
        disabled={userHasUpvoted === true} // Disable if user has already upvoted
        className={`flex items-center gap-1 ${isCard ? 'px-2 py-0 h-7' : ''} ${
          userHasUpvoted 
            ? "bg-purple-500 hover:bg-purple-500" // No hover effect needed when disabled
            : "hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500"
        }`}
      >
        <ChevronUp size={isCard ? 14 : 16} className={userHasUpvoted ? "animate-pulse-once" : ""} />
        <span className={isCard ? "text-xs" : ""}>{upvotes}</span>
      </Button>
      
      {/* Show email input after upvoting */}
      {userHasUpvoted && showEmailField && (
        <div className="flex flex-col gap-2 mt-3 w-full">
          <p className="text-sm text-gray-600">
            {isCard ? "Get notified when released:" : "Get notified when this feature is released (optional)"}
          </p>
          <div className="flex gap-1">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${isCard ? "h-7 text-xs" : ""} flex-1`}
              onClick={(e) => e.stopPropagation()}
            />
            <Button 
              onClick={handleEmailSubmit}
              disabled={!isEmailValid}
              size="sm"
              className={`bg-white text-black border border-black hover:bg-gray-100 ${isCard ? "h-7 px-2 py-0" : ""}`}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
