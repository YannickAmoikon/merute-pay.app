import { API_URL } from "@/config/api.config";

interface LoginResponse {
  token: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}


export async function authenticate(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Identifiants incorrects');
  }

  return response.json();
} 