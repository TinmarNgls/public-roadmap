import { useState, useEffect } from 'react';
import { Project } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchIdeas, toggleUpvote, removeUpvote, addComment, createIdea } from '@/lib/supabase/api';

export function useProjects() {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newIdeaId, setNewIdeaId] = useState<string | null>(null);
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

  // Handle remove upvote mutation
  const removeUpvoteMutation = useMutation({
    mutationFn: (id: string) => removeUpvote(id),
    onSuccess: (data) => {
      if (data.removed) {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      } else {
        console.error('Failed to remove upvote:', data);
        toast({
          title: "Error",
          description: "Failed to remove your vote. Please try again.",
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      console.error('Error removing upvote:', error);
      toast({
        title: "Error",
        description: "Failed to remove your vote. Please try again.",
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

  // Function to call the webhook
  const callWebhook = async (ideaData: { id: string; title: string; description: string; created_by: string; created_at: string; status: string }) => {
    try {
      console.log('Calling webhook with idea data:', ideaData);
      await fetch('https://hook.eu1.make.com/0ol3ly1sse9rc8nyb1ouqj2tpmhehxcf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(ideaData),
      });
      console.log('Webhook called successfully');
    } catch (error) {
      console.error('Error calling webhook:', error);
      // Don't show error to user as this is a background operation
    }
  };

  // Handle new idea mutation
  const newIdeaMutation = useMutation({
    mutationFn: ({ title, description, author }: { title: string; description: string; author: string }) => 
      createIdea(title, description, author),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewIdeaId(data.id); // Set the new idea ID so it will be focused when displayed
      
      // Call webhook with the new idea data
      await callWebhook({
        id: data.id,
        title: data.title,
        description: data.description,
        created_by: data.created_by,
        created_at: data.created_at,
        status: data.status
      });
      
      toast({
        title: "Idea submitted!",
        description: "Thank you for your contribution.",
      });
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
    upvoteMutation.mutate({ id, email });
  };

  const handleRemoveUpvote = (id: string) => {
    removeUpvoteMutation.mutate(id);
  };

  const handleAddComment = (id: string, comment: Omit<import('../types').Comment, 'id' | 'createdAt'>) => {
    commentMutation.mutate({ 
      ideaId: id, 
      author: comment.author, 
      content: comment.content 
    });
  };

  const handleNewIdeaSubmit = (title: string, description: string, author: string) => {
    newIdeaMutation.mutate({ title, description, author });
  };

  return {
    filteredProjects,
    isLoading: isLoadingProjects,
    searchQuery,
    setSearchQuery,
    newIdeaId,
    setNewIdeaId,
    newIdeaMutation,
    handleUpvote,
    handleRemoveUpvote,
    handleAddComment,
    handleNewIdeaSubmit,
  };
}
