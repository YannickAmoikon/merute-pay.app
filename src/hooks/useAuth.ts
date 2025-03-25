"use client"

import {useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const checkAuth = async () => {
      const hasAuthToken = document.cookie.includes('authToken');

      if (isAuthenticated && !hasAuthToken) {
        setIsAuthenticated(false);
        router.push('/admin/login');
        router.refresh();
      } else {
        setIsAuthenticated(hasAuthToken);
      }
    };

    checkAuth();

    const interval = setInterval(checkAuth, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(loadingTimer);
    };
  }, [router, isAuthenticated]);

  const logout = async () => {
    setIsLoading(true);
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setIsAuthenticated(false);
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/admin/login');
    router.refresh();
  };

  return {isAuthenticated, isLoading, logout};
} 