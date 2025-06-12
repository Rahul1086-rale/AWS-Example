import React, { useContext } from "react";
import { IconButton, Box } from "@mui/material";
import { ColorModeContext } from "../ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeToggle = () => {
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        bgcolor: "background.paper",
        borderRadius: "50%",
        boxShadow: 3,
      }}
    >
      <IconButton onClick={toggleColorMode} size="large">
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Box>
  );
};

export default ThemeToggle;
