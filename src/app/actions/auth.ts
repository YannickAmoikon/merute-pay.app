"use server"

import { cookies } from "next/headers";
import { authenticate } from "@/services/auth.service";

export async function loginAction(formData: FormData) {
  try {
    const username = formData.get("userName") as string;
    const password = formData.get("password") as string;

    const { token } = await authenticate({ username, password });
    
    (await cookies()).set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 // 24 heures
    });

    // Retourner le token pour la mise à jour côté client
    return { 
      success: true,
      token: token 
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur d'authentification"
    };
  }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("authToken");
    return { success: true };
} 