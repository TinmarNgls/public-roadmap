
import React, { useState } from 'react';
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
  const isEmailValid = email.includes('@');
  
  const handleEmailSubmit = () => {
    if (onEmailSubmit && isEmailValid) {
      onEmailSubmit(email);
      setEmail('');
    }
  };

  return (
    <div className={isCard ? "flex flex-col items-end" : ""}>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onUpvote();
        }}
        variant={userHasUpvoted ? "default" : "outline"}
        size="sm"
        className={`flex items-center gap-1 ${isCard ? 'px-2 py-0 h-7' : ''} ${
          userHasUpvoted 
            ? "bg-purple-500 hover:bg-purple-600" 
            : "hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500"
        }`}
      >
        <ChevronUp size={isCard ? 14 : 16} className={userHasUpvoted ? "animate-pulse-once" : ""} />
        <span className={isCard ? "text-xs" : ""}>{upvotes}</span>
      </Button>
      
      {/* Show email input AFTER upvoting */}
      {userHasUpvoted && showEmailInput && (
        <div className={`${isCard ? "w-full mt-2" : ""} flex ${isCard ? "flex-col" : ""} gap-${isCard ? "2" : "3"} ${!isCard ? "mt-3" : ""}`}>
          <p className={`text-${isCard ? "xs" : "sm"} text-gray-600`}>
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
              onClick={(e) => {
                e.stopPropagation();
                handleEmailSubmit();
              }}
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
