import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { ThemeMode } from '../types';

type ThemeContextType = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<ThemeMode>('theme', 'light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Apply theme class to HTML element
  React.useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme class and add current theme class
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const value = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};