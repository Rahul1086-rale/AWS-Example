import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeToggle from "./ThemeToggle";

export default function Layout({ children, onLogout, user }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const drawerWidth = 220;

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const drawer = (
    <List sx={{ mt: 1 }}>
      <ListItem button>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Planner" />
      </ListItem>
    </List>
  );

  return (
    <>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          height: 48,
          justifyContent: "center",
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: "48px !important", px: 2 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer}
              size="small"
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}

          <Typography
            variant="subtitle1"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              fontSize: "1rem",
              letterSpacing: 0.5,
            }}
          >
            TaskScheduler
          </Typography>

          <IconButton onClick={handleMenuOpen} color="inherit" size="small">
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                borderRadius: "12px",
                width: 32,
                height: 32,
                fontSize: "0.85rem",
              }}
            >
              {user?.username?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                borderRadius: 3,
                mt: 1,
                minWidth: 180,
              },
            }}
          >
            <MenuItem disabled>
              👋 Hello, {user?.username || user?.email || "User"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onLogout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? drawerOpen : true}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderTopRightRadius: isMobile ? 16 : 0,
            borderBottomRightRadius: 16,
            boxShadow: isMobile ? 3 : "none",
            mt: isMobile ? 0 : 0,
            pt: 1,
          },
        }}
      >
        {/* Reserve space below AppBar */}
        <Toolbar variant="dense" sx={{ minHeight: 48 }} />
        {drawer}
      </Drawer>

      {/* Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 2,
          pt: "56px",
          ml: isMobile ? 0 : `${drawerWidth}px`,
          transition: "margin 0.3s ease",
        }}
      >
        {children}
      </Box>

      <ThemeToggle />
    </>
  );
}
