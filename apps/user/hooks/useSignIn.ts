import { PATH, currentUrl } from '@/constants/path';
import { QUERY_KEYS } from '@/constants/queryKeys';
import createClient from '@dst/supabase/createClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useSignIn() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${currentUrl}/auth/callback?redirect=${PATH.PROTECTED}`,
        },
      });

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
