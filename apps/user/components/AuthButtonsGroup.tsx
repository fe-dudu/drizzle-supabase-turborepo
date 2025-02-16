'use client';

import useAuthSession from '@/hooks/useSession';
import KakaoSignInButton from './KakaoSignInButton';
import SignOutButton from './SignOutButton';

export default function AuthButtonsGroup() {
  const { data: session } = useAuthSession();

  return session ? <SignOutButton /> : <KakaoSignInButton />;
}
