import { supabase } from './client';
import type { Project, Comment } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Ideas API
export async function fetchIdeas() {
  const { data: ideas, error } = await supabase
    .from('ideas')
    .select(`
      id,
      created_by,
      created_at,
      status,
      title,
      description
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ideas:', error);
    throw error;
  }

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
        submittedAt: idea.created_at,
        submittedBy: idea.created_by,
        userHasUpvoted: false // Will be updated in the component
      };
    })
  );

  return ideasWithDetails as Project[];
}

export async function createIdea(title: string, description: string, author: string) {
  const { data, error } = await supabase
    .from('ideas')
    .insert([
      {
        title,
        description,
        created_by: author,
        status: 'consideration'
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
  // First check if an upvote with this email exists
  const { data: existingUpvotes } = await supabase
    .from('upvotes')
    .select('id')
    .eq('idea_id', ideaId)
    .eq('email', email || '');

  // If upvote exists, remove it
  if (existingUpvotes && existingUpvotes.length > 0) {
    const { error } = await supabase
      .from('upvotes')
      .delete()
      .eq('id', existingUpvotes[0].id);
    
    if (error) {
      console.error('Error removing upvote:', error);
      throw error;
    }

    return { added: false, upvoteId: null };
  }
  // Otherwise add a new upvote
  else {
    const { data, error } = await supabase
      .from('upvotes')
      .insert([
        {
          idea_id: ideaId,
          email: email || null
        }
      ])
      .select();

    if (error) {
      console.error('Error adding upvote:', error);
      throw error;
    }

    return { added: true, upvoteId: data[0].id };
  }
}

// Check if user has already upvoted
export async function checkUserUpvote(ideaId: string, email?: string) {
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
