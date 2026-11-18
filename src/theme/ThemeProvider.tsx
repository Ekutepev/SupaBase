import { createContext, useContext, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { dark, light, type Colors } from "./colors";

type Theme = {
  colors: Colors;
  isDark: boolean;
};

const ThemeContext = createContext<Theme>({ colors: light, isDark: false });

// Wrap the app in this once. It reads the phone's light/dark setting
// and re-renders everything below it when that setting changes.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <ThemeContext.Provider value={{ colors: isDark ? dark : light, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Use this in any component: const { colors } = useTheme();
export function useTheme() {
  return useContext(ThemeContext);
}
