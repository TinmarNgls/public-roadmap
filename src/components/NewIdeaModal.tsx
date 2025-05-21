
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      <DialogContent className="sm:max-w-xl bg-[#1a1c23] border border-gray-800 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-100">Submit a new idea</DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            Have a brilliant idea for Shotgun? Let's hear it!
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[75vh]">
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-300">
                Idea title*
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A short, descriptive title"
                required
                className="bg-[#252830] border-gray-700 text-gray-200 placeholder:text-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-300">
                Short description*
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your idea in a few sentences"
                rows={4}
                required
                className="bg-[#252830] border-gray-700 text-gray-200 placeholder:text-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium text-gray-300">
                Organiser name or organisation*
              </label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name or organisation"
                required
                className="bg-[#252830] border-gray-700 text-gray-200 placeholder:text-gray-500"
              />
            </div>
          </form>
        </ScrollArea>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-white/10 border-white/10 text-gray-200 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewIdeaModal;
