interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export async function register(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  const baseUrl = import.meta.env.VITE_API_URL;

  const response = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message ?? `Error ${response.status}`,
    );
  }

  return response.json() as Promise<RegisterResponse>;
}
