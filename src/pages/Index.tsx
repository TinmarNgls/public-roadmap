
import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import NewIdeaModal from '@/components/NewIdeaModal';
import PageHeader from '@/components/PageHeader';
import ProjectSearch from '@/components/ProjectSearch';
import ProjectDisplay from '@/components/ProjectDisplay';
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
