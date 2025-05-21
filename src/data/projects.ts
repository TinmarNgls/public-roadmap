
import { Project } from "../types";

export const initialProjects: Project[] = [
  {
    id: "1",
    title: "User Authentication System",
    description: "Implement secure login and registration functionality with social auth options.",
    status: "released",
    upvotes: 42,
    comments: [
      {
        id: "c1",
        author: "Sarah Johnson",
        content: "Great job on the implementation! The social login works smoothly.",
        createdAt: "2025-05-15T10:30:00Z",
      },
      {
        id: "c2",
        author: "Miguel Rodriguez",
        content: "Love the SSO integration. Makes logging in so much easier!",
        createdAt: "2025-05-16T14:22:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Dashboard Analytics",
    description: "Build an analytics dashboard with data visualization and custom reporting.",
    status: "ongoing",
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
    status: "next_up",
    upvotes: 27,
    comments: [],
  },
  {
    id: "4",
    title: "AI Content Generator",
    description: "Implement AI-powered content generation tools for marketing materials.",
    status: "next_up",
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
    status: "ongoing",
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
    status: "submitted",
    upvotes: 31,
    comments: [],
  },
  {
    id: "7",
    title: "Dark Mode Support",
    description: "Implement a toggle for dark mode across all application interfaces.",
    status: "released",
    upvotes: 48,
    comments: [
      {
        id: "c6",
        author: "Taylor Kim",
        content: "The dark mode looks fantastic! Much easier on the eyes.",
        createdAt: "2025-05-12T16:05:00Z",
      },
    ],
  },
  {
    id: "8",
    title: "Notification System Overhaul",
    description: "Redesign the notification system with customizable preferences and better organization.",
    status: "submitted",
    upvotes: 23,
    comments: [],
  },
];
