export const currentUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const PATH = {
  SIGN_IN: '/sign-in',
  PROTECTED: '/protected',
} as const;
