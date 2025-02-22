// /theme/ThemeProvider.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Appearance } from 'react-native';

const lightTheme = {
  colors: {
    background: '#fff8f0',      // a warm off-white background
    text: '#333333',            // dark text for readability
    primary: '#ff3366',         // vibrant primary color
    card: '#ffffff',            // clean white card background
    border: '#f0d9c3',          // a subtle, warm border color
  },
};

const darkTheme = {
  colors: {
    background: '#1e1e2d',
    text: '#ffffff',
    primary: '#ff3366',
    card: '#2e2e3d',
    border: '#444444',
  },
};

export const ThemeContext = createContext({
  themeMode: 'system',
  setThemeMode: (mode: string) => {},
  theme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState('system');
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const updateTheme = () => {
      let currentTheme = lightTheme;
      if (themeMode === 'dark' || (themeMode === 'system' && Appearance.getColorScheme() === 'dark')) {
        currentTheme = darkTheme;
      }
      setTheme(currentTheme);
    };

    updateTheme();
    const subscription = Appearance.addChangeListener(() => {
      if (themeMode === 'system') {
        updateTheme();
      }
    });
    return () => subscription.remove();
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const { theme } = React.useContext(ThemeContext);
  return theme;
};
