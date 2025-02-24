"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Timer pour arrêter le chargement après 2 secondes
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Vérifier si le token existe dans les cookies
    const checkAuth = async () => {
      const hasAuthToken = document.cookie.includes('authToken=');
      
      if (isAuthenticated && !hasAuthToken) {
        // Si on était authentifié mais que le token a disparu
        setIsAuthenticated(false);
        router.push('/admin/login');
        router.refresh();
      } else {
        setIsAuthenticated(hasAuthToken);
      }
    };

    // Vérifier immédiatement
    checkAuth();

    // Vérifier toutes les 2 secondes
    const interval = setInterval(checkAuth, 2000);

    // Nettoyer les timers lors du démontage du composant
    return () => {
      clearInterval(interval);
      clearTimeout(loadingTimer);
    };
  }, [router, isAuthenticated]);

  const logout = async () => {
    setIsLoading(true);
    // Supprimer le cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setIsAuthenticated(false);
    // Court délai pour l'animation
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/admin/login');
    router.refresh();
  };

  return { isAuthenticated, isLoading, logout };
} 