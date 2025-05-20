
import React, { useState, useEffect } from 'react';
import { Comment, Project } from '../types';
import { initialProjects } from '../data/projects';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import StatusFilter from '@/components/StatusFilter';
import SortOptions from '@/components/SortOptions';
import { Input } from '@/components/ui/input';
import { MessageCircle } from 'lucide-react';

type FilterOption = 'all' | 'in-progress' | 'planned' | 'consideration';
type SortOption = 'upvotes' | 'newest';
type SortDirection = 'asc' | 'desc';

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('upvotes');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
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
    
    // Apply filters
    if (activeFilter !== 'all') {
      result = result.filter(project => project.status === activeFilter);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        project =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'upvotes') {
        return sortDirection === 'asc' ? a.upvotes - b.upvotes : b.upvotes - a.upvotes;
      } else {
        // For demo purposes, we'll use project IDs as a proxy for "newest"
        // In a real app, you would use creation timestamps
        return sortDirection === 'asc' 
          ? parseInt(a.id) - parseInt(b.id)
          : parseInt(b.id) - parseInt(a.id);
      }
    });
    
    setFilteredProjects(result);
  }, [projects, activeFilter, searchQuery, sortBy, sortDirection]);

  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter);
  };

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Help shape our product
            </h2>
            <p className="text-gray-600">
              Browse through our roadmap, upvote features you'd like to see, and share your feedback.
            </p>
          </div>
          
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="md:flex md:justify-between md:items-center mb-6">
            <StatusFilter 
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
            
            <SortOptions
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={setSortBy}
              onDirectionChange={setSortDirection}
            />
          </div>
          
          {filteredProjects.length > 0 ? (
            <div className="space-y-6">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onUpvote={handleUpvote}
                  onAddComment={handleAddComment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
