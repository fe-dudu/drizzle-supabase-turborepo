'use client';

import useSignIn from '@/hooks/useSignIn';

export default function KakaoSignInButton() {
  const { mutate, isPending } = useSignIn();

  return (
    <button disabled={isPending} onClick={() => mutate()}>
      Login with Kakao
    </button>
  );
}
