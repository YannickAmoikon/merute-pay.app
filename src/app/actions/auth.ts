"use server"
import {cookies} from "next/headers";
import {authenticate} from "@/services/auth.service";
import CryptoJS from "crypto-js";

export async function loginAction(formData: FormData) {
  try {
    // Récupérer tous les paramètres du formulaire
    const entries = Array.from(formData.entries());

    // On s'attend à avoir exactement 3 paramètres
    if (entries.length !== 3) {
      return {
        success: false,
        error: "Format de données invalide"
      };
    }

    let encryptedUserName: string | null = null;
    let encryptedPassword: string | null = null;
    let encryptionKey: string | null = null;



    for (const [value] of entries) {
      if (!encryptedUserName) {
        encryptedUserName = value as string;
      } else if (!encryptedPassword) {
        encryptedPassword = value as string;
      } else {
        encryptionKey = value as string;
      }
    }

    if (!encryptedUserName || !encryptedPassword || !encryptionKey) {
      return {
        success: false,
        error: "Données de formulaire incomplètes"
      };
    }

    // Déchiffrer les données
    const username = CryptoJS.AES.decrypt(encryptedUserName, encryptionKey).toString(CryptoJS.enc.Utf8);
    const password = CryptoJS.AES.decrypt(encryptedPassword, encryptionKey).toString(CryptoJS.enc.Utf8);

    if (!username || !password) {
      return {
        success: false,
        error: "Échec du déchiffrement des identifiants"
      };
    }

    // Authentification avec les données déchiffrées
    const {token} = await authenticate({username, password});
    
    // Configuration du cookie
    (await cookies()).set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 // 24 heures
    });

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
  return {success: true};
}
