import { QUERY_KEYS } from '@/constants/queryKeys';
import createClient from '@dst/supabase/createClient';
import type { Session } from '@supabase/auth-js';
import { useQuery } from '@tanstack/react-query';

export default function useAuthSession() {
  const supabase = createClient();

  return useQuery({
    queryKey: QUERY_KEYS.SESSION,
    queryFn: async (): Promise<Session | null> => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return data.session;
    },
  });
}
