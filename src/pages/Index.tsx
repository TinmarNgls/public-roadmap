
import React, { useState, useEffect } from 'react';
import { Comment, Project } from '../types';
import { initialProjects } from '../data/projects';
import { useToast } from '@/hooks/use-toast';
import KanbanBoard from '@/components/KanbanBoard';
import { Input } from '@/components/ui/input';
import { MessageCircle } from 'lucide-react';

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  const handleUpvote = (id: string) => {
    setProjects(projects.map(project => {
      if (project.id === id) {
        const userHasUpvoted = !project.userHasUpvoted;
        return {
          ...project,
          upvotes: userHasUpvoted ? project.upvotes + 1 : project.upvotes - 1,
          userHasUpvoted
        };
      }
      return project;
    }));
    
    toast({
      title: "Thanks for your feedback!",
      description: "Your vote has been recorded.",
    });
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
        
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        {filteredProjects.length > 0 ? (
          <KanbanBoard 
            projects={filteredProjects} 
            onUpvote={handleUpvote} 
            onAddComment={handleAddComment} 
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
    </div>
  );
};

export default Index;
