
export type Status = 'released' | 'ongoing' | 'next_up' | 'submitted';

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: Status;
  upvotes: number;
  comments: Comment[];
  userHasUpvoted?: boolean;
  submittedAt?: string;
  submittedBy?: string;
  statusUpdatedAt?: string;
}
