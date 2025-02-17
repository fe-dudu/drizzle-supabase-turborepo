import { PATH } from '@/constants/path';
import { QUERY_KEYS } from '@/constants/queryKeys';
import createClient from '@dst/supabase/createClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const currentUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export default function useSignIn() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      alert(`${currentUrl}/api/auth/callback?redirect=${PATH.PROTECTED}`);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${currentUrl}/api/auth/callback?redirect=${PATH.PROTECTED}`,
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
