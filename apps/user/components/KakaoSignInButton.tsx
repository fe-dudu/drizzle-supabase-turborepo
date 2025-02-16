'use client';

import { PATH } from '@/constants/path';
import useSignIn from '@/hooks/useSignIn';
import { useRouter } from 'next/navigation';

export default function KakaoSignInButton() {
  const router = useRouter();
  const { mutate, isPending } = useSignIn();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        mutate(undefined, { onSuccess: () => router.push(PATH.PROTECTED) });
      }}
    >
      Login with Kakao
    </button>
  );
}
