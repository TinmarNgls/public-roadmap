
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

interface ChangelogAnnouncement {
  id: string;
  date: string;
  title_en: string;
  title_fr?: string;
  title_pt_pt?: string;
  title_pt_br?: string;
  content_en: string;
  content_fr?: string;
  content_pt_pt?: string;
  content_pt_br?: string;
}

export const useChangelogData = () => {
  return useQuery({
    queryKey: ['changelog-announcements'],
    queryFn: async () => {
      console.log('Fetching changelog announcements...');

      const { data, error } = await supabase
        .from('changelog_announcements')
        .select(`
          id, 
          date, 
          title_en,
          title_fr,
          title_pt_pt,
          title_pt_br,
          content_en,
          content_fr,
          content_pt_pt,
          content_pt_br
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }

      console.log('Fetched announcements:', data);
      return data as ChangelogAnnouncement[];
    }
  });
};
