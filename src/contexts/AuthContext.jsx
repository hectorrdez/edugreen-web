import { createContext, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{ isLogged: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
