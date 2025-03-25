"use client"

import Header from "@/components/blocks/header/header.component";
import { ReactNode } from "react";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader } from "@/components/blocks/frees/loader.component"

export default function DashboardLayout({children} : Readonly<{children : ReactNode}>) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isAuthenticated = false;

        const checkAuth = () => {
            const hasAuthToken = document.cookie.includes('authToken=');
            
            // Si le statut d'authentification a changé
            if (hasAuthToken !== isAuthenticated) {
                isAuthenticated = hasAuthToken;
                if (!hasAuthToken) {
                    router.push('/admin/login');
                }
            }
        };

        // Vérification initiale
        checkAuth();

        // Timer pour arrêter le chargement
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        // Écouter les changements de cookie
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'authToken') {
                checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Nettoyage
        return () => {
            clearTimeout(loadingTimer);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex flex-1">
            <div className="flex flex-col h-screen w-full">
                <Header/>
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}