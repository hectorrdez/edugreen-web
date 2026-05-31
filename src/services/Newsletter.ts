import ApiClient from "./ApiClient";

export async function insertNewEmail(email: string): Promise<void> {
  await ApiClient.post("/newsletter", { email });
}

export function canInsertEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
