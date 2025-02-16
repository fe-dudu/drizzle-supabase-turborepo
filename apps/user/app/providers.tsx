import { TanstackQueryProvider } from '@dst/tanstack-query';

export function Providers({ children }: { children: React.ReactNode }) {
  return <TanstackQueryProvider>{children}</TanstackQueryProvider>;
}
