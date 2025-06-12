// src/ThemeContext.js
import { createContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { deepmerge } from '@mui/utils';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const lightPalette = {
  palette: {
    mode: "light",
    primary: {
      main: "#6750A4",
    },
    background: {
      default: "#fefefe",
      paper: "#ffffff",
    },
  },
};

const darkPalette = {
  palette: {
    mode: "dark",
    primary: {
      main: "#D0BCFF",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
  },
};

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "light");

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prev) => {
        const newMode = prev === "light" ? "dark" : "light";
        localStorage.setItem("theme", newMode);
        return newMode;
      });
    },
  }), []);


  const theme = useMemo(
    () => createTheme(deepmerge(mode === "light" ? lightPalette : darkPalette, {})),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
