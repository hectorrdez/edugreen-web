import { createContext, useContext } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}

export default function useTheme() {
  return useContext(ThemeContext);
}
