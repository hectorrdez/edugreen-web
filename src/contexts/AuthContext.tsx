import React, { useContext, useState } from "react";

export class AuthData {
  id: number = 0;
  email: string = "";
  name: string = "";
  token: string = "";
  role: string = "";
}

type AuthContextValue = {
  auth: AuthData | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthData | null>>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthData | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
