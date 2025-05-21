
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NewIdeaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, author: string) => void;
  isSubmitting?: boolean;
}

const NewIdeaModal: React.FC<NewIdeaModalProps> = ({ 
  open, 
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !author.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all the fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      onSubmit(title.trim(), description.trim(), author.trim());
      
      // Reset form
      setTitle('');
      setDescription('');
      setAuthor('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your idea. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit a new idea</DialogTitle>
            <DialogDescription>
              Have a brilliant idea for Shotgun? Let's hear it!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Idea title*
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A short, descriptive title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Short description*
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your idea in a few sentences"
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium">
                Organiser name or organisation*
              </label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name or organisation"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewIdeaModal;
