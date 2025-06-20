import { supabase } from './client';
import type { Project, Comment } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development when Supabase is not connected
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Improved mobile ticket scanning',
    description: 'Add the ability to scan multiple tickets in a single go, rather than one by one.',
    status: 'ongoing',
    upvotes: 42,
    comments: [
      {
        id: '101',
        author: 'Jane Smith',
        content: 'This would be a huge time saver for our events!',
        createdAt: '2025-04-15T10:30:00Z'
      }
    ],
    submittedAt: '2025-03-10T08:20:00Z',
    submittedBy: 'Event Organizer XYZ',
    userHasUpvoted: false
  },
  {
    id: '2',
    title: 'Automated email reminders',
    description: 'Send automated reminders to ticket holders X days before the event.',
    status: 'next_up',
    upvotes: 28,
    comments: [],
    submittedAt: '2025-03-15T14:45:00Z',
    submittedBy: 'Concert Promoter ABC',
    userHasUpvoted: false
  }
];

// Check if we're using mock data (no real Supabase connection)
const usingMockData = import.meta.env.DEV && 
  (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);

// Track upvoted ideas in session storage
const getUpvotedIdeas = (): Record<string, boolean> => {
  try {
    const upvotedIdeas = sessionStorage.getItem('upvotedIdeas');
    return upvotedIdeas ? JSON.parse(upvotedIdeas) : {};
  } catch (error) {
    console.error('Error reading from session storage:', error);
    return {};
  }
};

const setUpvotedIdea = (ideaId: string, upvoted: boolean): void => {
  try {
    const upvotedIdeas = getUpvotedIdeas();
    upvotedIdeas[ideaId] = upvoted;
    sessionStorage.setItem('upvotedIdeas', JSON.stringify(upvotedIdeas));
  } catch (error) {
    console.error('Error writing to session storage:', error);
  }
};

// Ideas API
export async function fetchIdeas(): Promise<Project[]> {
  // Return mock data if not connected to Supabase
  if (usingMockData) {
    console.log('Using mock project data - connect to Supabase for real data');
    return Promise.resolve([...mockProjects]);
  }

  try {
    const { data: ideas, error } = await supabase
      .from('ideas')
      .select(`
        id,
        created_by,
        created_at,
        status,
        title,
        description,
        status_updated_at
      `)
      .neq('status', 'archived') // Filter out archived ideas
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ideas:', error);
      throw error;
    }

    // Get upvoted ideas from session storage
    const upvotedIdeas = getUpvotedIdeas();

    // Fetch comments and upvotes for each idea
    const ideasWithDetails = await Promise.all(
      ideas.map(async (idea) => {
        const { data: comments } = await supabase
          .from('comments')
          .select('*')
          .eq('idea_id', idea.id)
          .order('created_at', { ascending: true });
        
        const { count: upvoteCount } = await supabase
          .from('upvotes')
          .select('id', { count: 'exact', head: true })
          .eq('idea_id', idea.id);

        // Format to match our Project type
        return {
          id: idea.id,
          title: idea.title,
          description: idea.description,
          status: idea.status as any,
          upvotes: upvoteCount || 0,
          comments: comments?.map(c => ({
            id: c.id,
            author: c.created_by,
            content: c.comment,
            createdAt: c.created_at
          })) || [],
          statusUpdatedAt: idea.status_updated_at,
          userHasUpvoted: !!upvotedIdeas[idea.id]  // Check session storage for upvote status
        };
      })
    );

    return ideasWithDetails;
  } catch (error) {
    console.error('Error in fetchIdeas:', error);
    return [...mockProjects]; // Fallback to mock data on error
  }
}

export async function createIdea(title: string, description: string, author: string) {
  if (usingMockData) {
    console.log('Using mock data - this idea would be created in Supabase');
    const mockIdea = {
      id: uuidv4(),
      title,
      description,
      created_by: author,
      created_at: new Date().toISOString(),
      status: 'submitted'
    };
    mockProjects.unshift({
      id: mockIdea.id,
      title: mockIdea.title,
      description: mockIdea.description,
      status: 'submitted',
      upvotes: 0,
      comments: [],
      submittedAt: mockIdea.created_at,
      submittedBy: mockIdea.created_by,
      userHasUpvoted: false
    });
    return mockIdea;
  }

  const { data, error } = await supabase
    .from('ideas')
    .insert([
      {
        title,
        description,
        created_by: author,
        status: 'submitted'
      }
    ])
    .select();

  if (error) {
    console.error('Error creating idea:', error);
    throw error;
  }
  
  return data[0];
}

// Comments API
export async function addComment(ideaId: string, authorName: string, commentText: string) {
  if (usingMockData) {
    console.log('Using mock data - this comment would be added in Supabase');
    const mockComment = {
      id: uuidv4(),
      created_by: authorName,
      comment: commentText,
      created_at: new Date().toISOString()
    };
    
    const project = mockProjects.find(p => p.id === ideaId);
    if (project) {
      project.comments.push({
        id: mockComment.id,
        author: mockComment.created_by,
        content: mockComment.comment,
        createdAt: mockComment.created_at
      });
    }
    
    return {
      id: mockComment.id,
      author: mockComment.created_by,
      content: mockComment.comment,
      createdAt: mockComment.created_at
    } as Comment;
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        idea_id: ideaId,
        created_by: authorName,
        comment: commentText
      }
    ])
    .select();

  if (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
  
  return {
    id: data[0].id,
    author: data[0].created_by,
    content: data[0].comment,
    createdAt: data[0].created_at
  } as Comment;
}

// Upvotes API
export async function toggleUpvote(ideaId: string, email?: string) {
  if (usingMockData) {
    console.log('Using mock data - this upvote would be toggled in Supabase');
    const project = mockProjects.find(p => p.id === ideaId);
    if (project) {
      if (project.userHasUpvoted) {
        project.upvotes--;
        project.userHasUpvoted = false;
        setUpvotedIdea(ideaId, false);
        return { added: false, upvoteId: null };
      } else {
        project.upvotes++;
        project.userHasUpvoted = true;
        setUpvotedIdea(ideaId, true);
        return { added: true, upvoteId: uuidv4() };
      }
    }
    return { added: false, upvoteId: null };
  }

  // Get upvote status from session storage
  const upvotedIdeas = getUpvotedIdeas();
  const hasUpvoted = upvotedIdeas[ideaId];

  // If already upvoted and an email is provided, we should just update the existing upvote
  if (hasUpvoted && email) {
    try {
      // Find the upvote(s) for this idea (may be without email)
      const { data: existingUpvotes } = await supabase
        .from('upvotes')
        .select('id')
        .eq('idea_id', ideaId);

      if (existingUpvotes && existingUpvotes.length > 0) {
        // Update the first upvote with the email
        const { data, error } = await supabase
          .from('upvotes')
          .update({ email: email })
          .eq('id', existingUpvotes[0].id)
          .select();

        if (error) {
          console.error('Error updating upvote with email:', error);
          throw error;
        }

        return { added: true, upvoteId: data[0].id, withEmail: true };
      }
    } catch (error) {
      console.error('Error updating upvote with email:', error);
      throw error;
    }
  }

  // If not yet upvoted, add a single upvote (with email if provided)
  if (!hasUpvoted) {
    try {
      const upvoteData: { idea_id: string; email?: string } = { 
        idea_id: ideaId
      };
      
      if (email) {
        upvoteData.email = email;
      }

      const { data, error } = await supabase
        .from('upvotes')
        .insert([upvoteData])
        .select();

      if (error) {
        console.error('Error adding upvote:', error);
        throw error;
      }

      // Update session storage
      setUpvotedIdea(ideaId, true);
      
      return { added: true, upvoteId: data[0].id };
    } catch (error) {
      console.error('Error adding upvote:', error);
      throw error;
    }
  }

  return { added: true, alreadyUpvoted: true };
}

// Remove an upvote
export async function removeUpvote(ideaId: string) {
  if (usingMockData) {
    console.log('Using mock data - this upvote would be removed in Supabase');
    const project = mockProjects.find(p => p.id === ideaId);
    if (project && project.userHasUpvoted) {
      project.upvotes--;
      project.userHasUpvoted = false;
      setUpvotedIdea(ideaId, false);
      return { removed: true };
    }
    return { removed: false };
  }

  try {
    // Get upvote status from session storage
    const upvotedIdeas = getUpvotedIdeas();
    
    // Check if the user has upvoted this idea
    if (!upvotedIdeas[ideaId]) {
      return { removed: false, reason: 'not_upvoted' };
    }
    
    // Find all upvotes for this idea to ensure we delete the right one
    const { data: existingUpvotes } = await supabase
      .from('upvotes')
      .select('id')
      .eq('idea_id', ideaId);

    if (existingUpvotes && existingUpvotes.length > 0) {
      // Remove the upvote from Supabase (we don't have user info, so we delete based on idea_id only)
      // Note: In a real app with authentication, you would filter by user ID too
      const { error } = await supabase
        .from('upvotes')
        .delete()
        .eq('id', existingUpvotes[0].id);
      
      if (error) {
        console.error('Error removing upvote:', error);
        throw error;
      }
    } else {
      console.log('No upvote found to remove');
    }
    
    // Update session storage
    setUpvotedIdea(ideaId, false);
    
    return { removed: true };
  } catch (error) {
    console.error('Error removing upvote:', error);
    throw error;
  }
}

// Check if user has already upvoted
export async function checkUserUpvote(ideaId: string, email?: string) {
  if (usingMockData) {
    console.log('Using mock data for checkUserUpvote');
    const project = mockProjects.find(p => p.id === ideaId);
    return project?.userHasUpvoted || false;
  }
  
  // If no email, we can't check
  if (!email) return false;
  
  const { data, error } = await supabase
    .from('upvotes')
    .select('id')
    .eq('idea_id', ideaId)
    .eq('email', email);

  if (error) {
    console.error('Error checking upvote:', error);
    throw error;
  }

  return data && data.length > 0;
}
