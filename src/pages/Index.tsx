import React, { useState, useEffect } from 'react';
import { Comment, Project } from '../types';
import { useToast } from '@/hooks/use-toast';
import KanbanBoard from '@/components/KanbanBoard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle, PlusCircle } from 'lucide-react';
import NewIdeaModal from '@/components/NewIdeaModal';
import { fetchIdeas, toggleUpvote, addComment, createIdea } from '@/lib/supabase/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Index = () => {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [newIdeaId, setNewIdeaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch ideas from Supabase
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchIdeas,
  });

  // Handle upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: ({ id, email }: { id: string; email?: string }) => 
      toggleUpvote(id, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Error toggling upvote:', error);
      toast({
        title: "Error",
        description: "Failed to process your vote. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle comment mutation
  const commentMutation = useMutation({
    mutationFn: ({ ideaId, author, content }: { ideaId: string; author: string; content: string }) => 
      addComment(ideaId, author, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle new idea mutation
  const newIdeaMutation = useMutation({
    mutationFn: ({ title, description, author }: { title: string; description: string; author: string }) => 
      createIdea(title, description, author),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewIdeaId(data.id);
      toast({
        title: "Idea submitted!",
        description: "Thank you for your contribution.",
      });
      setShowNewIdeaModal(false);
    },
    onError: (error) => {
      console.error('Error creating idea:', error);
      toast({
        title: "Error",
        description: "Failed to submit your idea. Please try again.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    setIsLoading(isLoadingProjects);
  }, [isLoadingProjects]);

  useEffect(() => {
    let result = [...projects];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        project =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredProjects(result);
  }, [projects, searchQuery]);

  const handleUpvote = (id: string, email?: string) => {
    // Track upvote with email when provided
    upvoteMutation.mutate({ id, email });
  };

  const handleAddComment = (id: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    commentMutation.mutate({ 
      ideaId: id, 
      author: comment.author, 
      content: comment.content 
    });
  };

  const handleNewIdeaSubmit = (title: string, description: string, author: string) => {
    newIdeaMutation.mutate({ title, description, author });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What We're Building (Together)
          </h2>
          <p className="text-gray-600">
            Explore what's coming, vote on features, and let us know what would make Shotgun even better for your events
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start mb-6 justify-between">
          <Input
            type="search"
            placeholder="Search features or ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button 
            onClick={() => setShowNewIdeaModal(true)}
            className="flex-shrink-0 bg-purple-500 hover:bg-purple-600"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit a new idea
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading ideas...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <KanbanBoard 
            projects={filteredProjects} 
            onUpvote={handleUpvote} 
            onAddComment={handleAddComment}
            focusProjectId={newIdeaId}
            clearFocusProjectId={() => setNewIdeaId(null)}
          />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search to find what you're looking for.
            </p>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025 <a href="https://shotgun.live/" target="_blank" rel="noopener noreferrer" className="hover:underline">Shotgun</a>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <NewIdeaModal 
        open={showNewIdeaModal} 
        onClose={() => setShowNewIdeaModal(false)}
        onSubmit={handleNewIdeaSubmit}
        isSubmitting={newIdeaMutation.isPending}
      />
    </div>
  );
};

export default Index;
