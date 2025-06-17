
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

interface ChangelogAnnouncement {
  id: string;
  date: string;
  title: string;
  content: string;
}

export const useChangelogData = () => {
  return useQuery({
    queryKey: ['changelog-announcements'],
    queryFn: async () => {
      console.log('Fetching changelog announcements...');

      const { data, error } = await supabase
        .from('changelog_announcements')
        .select('id, date, title, content')
        .eq('published', true)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }

      console.log('Fetched announcements:', data);
      return data as ChangelogAnnouncement[];
    }
  });
};
