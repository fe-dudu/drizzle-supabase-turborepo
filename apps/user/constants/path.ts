export const currentUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const PATH = {
  SIGN_IN: '/sign-in',
  AUTH_CALLBACK: '/auth/callback',
  PROTECTED: '/protected',
} as const;
