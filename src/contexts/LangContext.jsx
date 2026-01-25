import { createContext, useContext } from "react";

export const LangContext = createContext();

export function LangProvider({ children }) {
  return <LangContext.Provider value={{}}>{children}</LangContext.Provider>;
}

export default function useLang() {
  return useContext(LangContext);
}
