interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const baseUrl = import.meta.env.VITE_API_URL;

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `Error ${response.status}`);
  }

  return response.json() as Promise<LoginResponse>;
}
