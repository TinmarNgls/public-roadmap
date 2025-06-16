
import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import NewIdeaModal from '@/components/NewIdeaModal';
import PageHeader from '@/components/PageHeader';
import ProjectSearch from '@/components/ProjectSearch';
import ProjectDisplay from '@/components/ProjectDisplay';
import ChangelogDisplay from '@/components/ChangelogDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { t } = useTranslation();
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  
  const {
    filteredProjects,
    isLoading,
    searchQuery,
    setSearchQuery,
    newIdeaId,
    setNewIdeaId,
    newIdeaMutation,
    handleUpvote,
    handleRemoveUpvote,
    handleAddComment,
    handleNewIdeaSubmit,
  } = useProjects();

  const handleSubmitNewIdea = (title: string, description: string, author: string) => {
    handleNewIdeaSubmit(title, description, author);
    setShowNewIdeaModal(false);
  };

  return (
    <div className="min-h-screen bg-[#222529]">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full max-w-none">
        <PageHeader />
        
        <Tabs defaultValue="roadmap" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6 bg-[#383b3e] border border-gray-700">
            <TabsTrigger 
              value="roadmap" 
              className="data-[state=active]:bg-[#7D55CA] data-[state=active]:text-white text-gray-300"
            >
              Roadmap
            </TabsTrigger>
            <TabsTrigger 
              value="changelog" 
              className="data-[state=active]:bg-[#7D55CA] data-[state=active]:text-white text-gray-300"
            >
              Changelog
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="roadmap">
            <ProjectSearch 
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              onNewIdeaClick={() => setShowNewIdeaModal(true)}
            />
            
            <ProjectDisplay 
              isLoading={isLoading}
              filteredProjects={filteredProjects}
              onUpvote={handleUpvote}
              onRemoveUpvote={handleRemoveUpvote}
              onAddComment={handleAddComment}
              focusProjectId={newIdeaId}
              clearFocusProjectId={() => setNewIdeaId(null)}
            />
          </TabsContent>
          
          <TabsContent value="changelog">
            <ChangelogDisplay />
          </TabsContent>
        </Tabs>
      </main>

      <NewIdeaModal 
        open={showNewIdeaModal} 
        onClose={() => setShowNewIdeaModal(false)}
        onSubmit={handleSubmitNewIdea}
        isSubmitting={newIdeaMutation.isPending}
      />
    </div>
  );
};

export default Index;
