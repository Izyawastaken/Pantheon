import React, { createContext, useContext, useState, useEffect } from 'react';

const AccentColorContext = createContext();

export const useAccentColor = () => {
  const context = useContext(AccentColorContext);
  if (!context) {
    throw new Error('useAccentColor must be used within an AccentColorProvider');
  }
  return context;
};

export const AccentColorProvider = ({ children }) => {
  const [accentColor, setAccentColor] = useState('#00f0ff');

  useEffect(() => {
    // Load accent color from localStorage
    const savedColor = localStorage.getItem('pantheon-accent-color');
    if (savedColor) {
      setAccentColor(savedColor);
    }
  }, []);

  useEffect(() => {
    // Update CSS custom property
    document.documentElement.style.setProperty('--accent-color', accentColor);
    // Save to localStorage
    localStorage.setItem('pantheon-accent-color', accentColor);
  }, [accentColor]);

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  );
};