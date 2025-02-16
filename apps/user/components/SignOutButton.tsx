'use client';

import { PATH } from '@/constants/path';
import useSignOut from '@/hooks/useSignOut';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const { mutate, isPending } = useSignOut();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        mutate(undefined, { onSuccess: () => router.push(PATH.SIGN_IN) });
      }}
    >
      Logout
    </button>
  );
}
