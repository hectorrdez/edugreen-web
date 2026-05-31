import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "@contexts/AccessContext";
import UserService, { type UserData } from "@services/UserService";

type UserContextValue = {
  user: UserData | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

type UserProviderProps = {
  children: React.ReactNode;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: UserProviderProps) {
  const auth = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async () => {
    const { id, sessionToken } = auth?.auth ?? {};
    if (!id || !sessionToken) return;

    setIsLoading(true);
    try {
      const data = await UserService.getOne(id, sessionToken);
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.auth) {
      fetchProfile();
    } else {
      setUser(null);
    }
  }, [auth?.auth?.sessionToken]);

  return (
    <UserContext.Provider value={{ user, isLoading, refresh: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export default function useUser() {
  return useContext(UserContext);
}
