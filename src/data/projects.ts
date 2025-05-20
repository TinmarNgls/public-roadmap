
import { Project } from "../types";

export const initialProjects: Project[] = [
  {
    id: "1",
    title: "User Authentication System",
    description: "Implement secure login and registration functionality with social auth options.",
    status: "in-progress",
    upvotes: 42,
    comments: [
      {
        id: "c1",
        author: "Sarah Johnson",
        content: "Looking forward to this! Will it include 2FA?",
        createdAt: "2025-05-15T10:30:00Z",
      },
      {
        id: "c2",
        author: "Miguel Rodriguez",
        content: "Great to see this is in progress. Hope to see SSO integration too!",
        createdAt: "2025-05-16T14:22:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Dashboard Analytics",
    description: "Build an analytics dashboard with data visualization and custom reporting.",
    status: "planned",
    upvotes: 38,
    comments: [
      {
        id: "c3",
        author: "Alex Chen",
        content: "Will this include export functionality to CSV?",
        createdAt: "2025-05-14T09:15:00Z",
      },
    ],
  },
  {
    id: "3",
    title: "Mobile App Integration",
    description: "Create native mobile apps for iOS and Android that sync with the web platform.",
    status: "consideration",
    upvotes: 27,
    comments: [],
  },
  {
    id: "4",
    title: "AI Content Generator",
    description: "Implement AI-powered content generation tools for marketing materials.",
    status: "consideration",
    upvotes: 19,
    comments: [
      {
        id: "c4",
        author: "Jordan Lee",
        content: "This would be a game-changer for our marketing team!",
        createdAt: "2025-05-10T11:45:00Z",
      },
    ],
  },
  {
    id: "5",
    title: "Team Collaboration Features",
    description: "Develop real-time collaboration tools including shared documents and task management.",
    status: "in-progress",
    upvotes: 56,
    comments: [
      {
        id: "c5",
        author: "Priya Sharma",
        content: "Will this include video conferencing or just text chat?",
        createdAt: "2025-05-18T13:20:00Z",
      },
    ],
  },
  {
    id: "6",
    title: "API Documentation Portal",
    description: "Create comprehensive API documentation with interactive examples and testing tools.",
    status: "planned",
    upvotes: 31,
    comments: [],
  },
  {
    id: "7",
    title: "Dark Mode Support",
    description: "Implement a toggle for dark mode across all application interfaces.",
    status: "in-progress",
    upvotes: 48,
    comments: [
      {
        id: "c6",
        author: "Taylor Kim",
        content: "Will this respect system preferences automatically?",
        createdAt: "2025-05-12T16:05:00Z",
      },
    ],
  },
  {
    id: "8",
    title: "Notification System Overhaul",
    description: "Redesign the notification system with customizable preferences and better organization.",
    status: "consideration",
    upvotes: 23,
    comments: [],
  },
];
