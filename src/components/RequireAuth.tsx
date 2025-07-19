import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/'); // hoặc '/login'
    }
  }, [isAuthenticated, isLoading]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
