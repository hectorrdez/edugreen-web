import React, { useContext, useEffect, useState } from "react";
import FullScreenLoader from "@components/feedback/FullScreenLoader";
import AccessService from "@services/AccessService";

export class AuthData {
  id: string = "";
  sessionToken: string = "";
  refreshToken: string = "";
  role: string = "";
}

type AccessContextValue = {
  auth: AuthData | null;
  setAuth: (auth: AuthData | null) => void;
  isLoading: boolean;
};

type AccessProviderProps = {
  children: React.ReactNode;
};

export const AccessContext = React.createContext<AccessContextValue | null>(
  null,
);

const STORAGE_KEY = "auth";

function loadStoredAuth(): AuthData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthData) : null;
  } catch {
    return null;
  }
}

export function AccessProvider({ children }: AccessProviderProps) {
  const [auth, setAuthState] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = (value: AuthData | null) => {
    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setAuthState(value);
  };

  useEffect(() => {
    const stored = loadStoredAuth();
    if (!stored?.refreshToken) {
      setIsLoading(false);
      return;
    }

    AccessService.refresh(stored.refreshToken)
      .then(({ sessionToken }) => {
        setAuth({ ...stored, sessionToken });
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <FullScreenLoader />;

  return (
    <AccessContext.Provider value={{ auth, setAuth, isLoading }}>
      {children}
    </AccessContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AccessContext);
}
