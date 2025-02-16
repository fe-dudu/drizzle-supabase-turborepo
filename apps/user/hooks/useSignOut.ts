import { QUERY_KEYS } from '@/constants/queryKeys';
import createClient from '@dst/supabase/createClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useSignOut() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SESSION,
      });
    },
  });
}
