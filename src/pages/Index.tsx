import React, { useState, useEffect } from 'react';
import { Comment, Project } from '../types';
import { initialProjects } from '../data/projects';
import { useToast } from '@/hooks/use-toast';
import KanbanBoard from '@/components/KanbanBoard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle, PlusCircle } from 'lucide-react';
import NewIdeaModal from '@/components/NewIdeaModal';

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [newIdeaId, setNewIdeaId] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Initialize projects from mock data
    // In a real application, this would be an API call
    setProjects(initialProjects.map(project => ({
      ...project,
      userHasUpvoted: false
    })));
  }, []);

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
    setProjects(projects.map(project => {
      if (project.id === id) {
        // If email is provided but we don't need to toggle the upvote
        if (email && project.userHasUpvoted) {
          // Just record the email notification without changing upvote status
          return project;
        }
        
        // Toggle upvote status
        const userHasUpvoted = !project.userHasUpvoted;
        return {
          ...project,
          upvotes: userHasUpvoted ? project.upvotes + 1 : project.upvotes - 1,
          userHasUpvoted
        };
      }
      return project;
    }));
    
    if (email) {
      toast({
        title: "Thanks for your feedback!",
        description: `We'll notify you at ${email} when this feature is released.`,
      });
    } else if (projects.find(p => p.id === id)?.userHasUpvoted === false) {
      // Only show toast for initial upvote
      toast({
        title: "Thanks for your feedback!",
        description: "Your vote has been recorded.",
      });
    }
  };

  const handleAddComment = (id: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment = {
      ...comment,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setProjects(projects.map(project => {
      if (project.id === id) {
        return {
          ...project,
          comments: [...project.comments, newComment]
        };
      }
      return project;
    }));
    
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    });
  };

  const handleNewIdeaSubmit = (title: string, description: string, author: string) => {
    const id = `idea-${Date.now()}`;
    const newProject: Project = {
      id,
      title,
      description,
      status: 'consideration',
      upvotes: 1,
      userHasUpvoted: true,
      comments: [],
      submittedAt: new Date().toISOString(),
      submittedBy: author
    };
    
    // Add the new idea to projects
    setProjects([...projects, newProject]);
    
    // Set the ID to focus on after closing the modal
    setNewIdeaId(id);
    
    // Close the modal
    setShowNewIdeaModal(false);
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
        
        {filteredProjects.length > 0 ? (
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
      />
    </div>
  );
};

export default Index;
