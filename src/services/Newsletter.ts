export async function insertNewEmail(email: string): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_URL;

  const response = await fetch(`${baseUrl}/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message ?? `Error ${response.status}`,
    );
  }
}

export function canInsertEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
