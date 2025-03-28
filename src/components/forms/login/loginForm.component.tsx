"use client"

import Image from "next/image";
import {useRouter} from "next/navigation"
import {cn} from "@/utils/utils";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState, useTransition, useEffect} from "react";
import {CircleDashed, Eye, EyeOff} from "lucide-react";
import {toast} from "sonner";
import {loginAction} from "@/app/actions/auth";
import {Label} from "@/components/ui/label";
import CryptoJS from "crypto-js";

// Générer des noms de paramètres aléatoires
const generateRandomParamName = () => {
  return `p${Math.random().toString(36).substring(2, 8)}`;
};

// Générer une nouvelle clé de chiffrement
const generateEncryptionKey = () => {
  return CryptoJS.lib.WordArray.random(16).toString();
};

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [encryptionKey, setEncryptionKey] = useState("");

  // Noms de paramètres aléatoires persistants pour cette session
  const [paramNames, setParamNames] = useState({
    userName: "",
    password: "",
    key: ""
  });

  // Générer une clé et des noms de paramètres au chargement du composant
  useEffect(() => {
    setEncryptionKey(generateEncryptionKey());
    setParamNames({
      userName: generateRandomParamName(),
      password: generateRandomParamName(),
      key: generateRandomParamName()
    });
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    // Récupérer les valeurs originales
    const userName = formData.get("userName") as string;
    const password = formData.get("password") as string;

    // Créer un nouveau FormData avec les données chiffrées
    const encryptedFormData = new FormData();

    // Chiffrer les données sensibles
    const encryptedUserName = CryptoJS.AES.encrypt(userName, encryptionKey).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, encryptionKey).toString();

    // Ajouter les données chiffrées avec des noms génériques
    encryptedFormData.append(paramNames.userName, encryptedUserName);
    encryptedFormData.append(paramNames.password, encryptedPassword);
    encryptedFormData.append(paramNames.key, encryptionKey);

    startTransition(async () => {
      try {
        const loadingToast = toast.loading("Connexion en cours...");
        const result = await loginAction(encryptedFormData);

        if (result.success) {
          // Mettre à jour le cookie dans le state client
          document.cookie = `authToken=${result.token}; path=/; max-age=${60 * 60 * 24}; secure; samesite=strict`;

          toast.dismiss(loadingToast);
          toast.success("Connexion réussie", {
            description: "Bienvenue sur Merute Pay !",
            duration: 3000,
          });

          // Force le rafraîchissement du router et de l'état
          router.refresh();

          // Attendre un court instant pour que le state soit mis à jour
          await new Promise(resolve => setTimeout(resolve, 500));

          // Redirection vers le menu
          router.push("/admin/main");
        } else {
          toast.dismiss(loadingToast);
          throw new Error(result.error);
        }
      } catch (error) {
        toast.error("Échec de connexion", {
          description: error instanceof Error ? error.message : "Identifiants incorrects",
          duration: 4000,
        });
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-4 md:gap-6 w-full max-w-sm mx-auto px-4 md:px-0", className)} {...props}>
      <div className="flex flex-col items-center gap-2 md:gap-4">
        <a
          href="#"
          className="flex flex-col items-center gap-3 md:gap-4 font-medium"
        >
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-md">
            <Image
              src="/pictures/logo.png"
              alt="logo"
              width={1000}
              height={1000}
              className="w-full h-full object-contain"
            />
          </div>
        </a>
        <h1 className="text-lg md:text-xl font-bold">MERUTE - PAY</h1>
        <div className="text-center text-sm">
          Entrez vos accès pour vous connecter
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="userName">Utilisateur</Label>
          <Input
            id="userName"
            name="userName"
            placeholder="administrateur"
            className="h-9 md:h-10"
            required
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="•••••••••••••"
              className="h-9 md:h-10"
              required
              minLength={4}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4"/>
              ) : (
                <Eye className="h-4 w-4"/>
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full h-9 md:h-10" disabled={isPending}>
          {isPending ? (
            <CircleDashed className="animate-spin"/>
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>

      <div
        className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        © {new Date().getFullYear()} MERUTE DIGITAL ORBITAL. Tous droits réservés
      </div>
    </div>
  );
}