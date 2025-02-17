import { PATH } from '@/constants/path';
import { QUERY_KEYS } from '@/constants/queryKeys';
import createClient from '@dst/supabase/createClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CALLBACK_URL = process.env.NEXT_PUBLIC_CALLBACK_URL
  ? process.env.NEXT_PUBLIC_CALLBACK_URL
  : 'http://localhost:3000';

export default function useSignIn() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${CALLBACK_URL}/api/auth/callback?redirect=${PATH.PROTECTED}`,
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
