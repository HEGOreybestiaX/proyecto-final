import type { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-route-enter min-h-screen">{children}</div>;
}
