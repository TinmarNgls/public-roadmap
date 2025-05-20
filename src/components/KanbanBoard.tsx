
import React from 'react';
import { Project, Status } from '../types';
import ProjectCard from './ProjectCard';
import { Rocket, Wrench, Brain, Pencil } from 'lucide-react';

interface KanbanBoardProps {
  projects: Project[];
  onUpvote: (id: string) => void;
  onAddComment: (id: string, comment: Omit<import('../types').Comment, 'id' | 'createdAt'>) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projects, onUpvote, onAddComment }) => {
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
  }[] = [
    { 
      id: 'released', 
      title: 'Recently Released', 
      icon: <Rocket size={20} />, 
      colorClass: 'bg-green-50 border-green-200 text-green-600' 
    },
    { 
      id: 'ongoing', 
      title: 'Ongoing', 
      icon: <Wrench size={20} />, 
      colorClass: 'bg-blue-50 border-blue-200 text-blue-600' 
    },
    { 
      id: 'consideration', 
      title: 'Under Consideration', 
      icon: <Brain size={20} />, 
      colorClass: 'bg-purple-50 border-purple-200 text-purple-600' 
    },
    { 
      id: 'backlog', 
      title: 'Backlog', 
      icon: <Pencil size={20} />, 
      colorClass: 'bg-gray-50 border-gray-200 text-gray-600' 
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-5 overflow-x-auto pb-8">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-full md:w-80 bg-gray-50 rounded-lg shadow-sm"
        >
          <div className={`p-3 flex items-center gap-2 border-b ${column.colorClass} rounded-t-lg`}>
            {column.icon}
            <h3 className="font-medium text-sm">{column.title}</h3>
            <span className="ml-auto bg-white rounded-full px-2 py-1 text-xs font-medium">
              {groupedProjects[column.id]?.length || 0}
            </span>
          </div>
          <div className="p-3 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto">
            {groupedProjects[column.id]?.length ? (
              groupedProjects[column.id].map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onUpvote={onUpvote}
                  onAddComment={onAddComment}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 text-sm">
                No projects in this column yet
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
