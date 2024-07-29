// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally verify token here or fetch user info
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/'); // Redirect to login if not authenticated
    }
    setLoading(false);
  }, [router]);

  return { isAuthenticated, loading };
}
