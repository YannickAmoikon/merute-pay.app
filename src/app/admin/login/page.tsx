"use client"

import {useRouter} from "next/navigation"
import {LoginForm} from "@/components/forms/login/loginForm.component";
import {useEffect} from "react";

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    // Vérifier la présence du cookie côté client
    const hasAuthToken = document.cookie.includes('authToken=');
    if (hasAuthToken) {
      router.push("/admin/main");
      router.refresh();
    }
  }, [router])

  return (
    <div className="relative min-h-svh">
      {/* Background div avec opacité */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/pictures/login.webp')`,
          opacity: 0.3
        }}
      />

      {/* Contenu du formulaire */}
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-4 md:p-6">
        <div className="w-full max-w-sm bg-background p-6 rounded-lg shadow-lg">
          <LoginForm/>
        </div>
      </div>
    </div>
  );
}