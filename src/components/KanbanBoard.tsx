
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Project, Status } from '../types';
import ProjectCard from './ProjectCard';
import { Rocket, Wrench, Eye, Archive } from 'lucide-react';

interface KanbanBoardProps {
  projects: Project[];
  onUpvote: (id: string, email?: string) => void;
  onRemoveUpvote: (id: string) => void;
  onAddComment: (id: string, comment: Omit<import('../types').Comment, 'id' | 'createdAt'>) => void;
  focusProjectId?: string | null;
  clearFocusProjectId?: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  projects,
  onUpvote,
  onRemoveUpvote,
  onAddComment,
  focusProjectId,
  clearFocusProjectId
}) => {
  const { t } = useTranslation();

  // Group projects by their status
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.status]) {
      acc[project.status] = [];
    }
    acc[project.status].push(project);
    return acc;
  }, {} as Record<Status, Project[]>);

  // Define column properties
  const columns: {
    id: Status;
    title: string;
    icon: React.ReactNode;
    colorClass: string;
  }[] = [{
    id: 'released',
    title: t('status.released'),
    icon: <Rocket size={18} />,
    colorClass: 'border-l-4 border-l-green-500 bg-[#383b3e]'
  }, {
    id: 'ongoing',
    title: t('status.ongoing'),
    icon: <Wrench size={18} />,
    colorClass: 'border-l-4 border-l-blue-500 bg-[#383b3e]'
  }, {
    id: 'next_up',
    title: t('status.next_up'),
    icon: <Eye size={18} />,
    colorClass: 'border-l-4 border-l-yellow-500 bg-[#383b3e]'
  }, {
    id: 'submitted',
    title: t('status.submitted'),
    icon: <Archive size={18} />,
    colorClass: 'border-l-4 border-l-gray-500 bg-[#383b3e]'
  }];

  return (
    <div className="flex flex-col md:flex-row gap-5 overflow-x-auto pb-8">
      {columns.map(column => (
        <div key={column.id} className="flex-shrink-0 w-full md:w-80 bg-[#383b3e] rounded-lg shadow-md">
          <div className={`p-3 flex items-center gap-2 ${column.colorClass} rounded-t-lg`}>
            <span className="text-gray-300">{column.icon}</span>
            <h3 className="font-medium text-sm text-gray-200">{column.title}</h3>
          </div>
          <div className="p-3 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto">
            {groupedProjects[column.id]?.length ? 
              groupedProjects[column.id].map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onUpvote={onUpvote} 
                  onRemoveUpvote={onRemoveUpvote} 
                  onAddComment={onAddComment} 
                  isFocused={project.id === focusProjectId} 
                  onDialogClose={clearFocusProjectId} 
                />
              )) : (
                <div className="text-center py-10 text-sm" style={{ color: '#9B9D9E' }}>
                  {t('project.noProjects')}
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
