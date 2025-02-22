import { createTheme } from "@mui/material/styles"

// Light theme colors remain the same
const lightPalette = {
  mode: "light",
  primary: {
    main: "#ffd4f7",
    contrastText: "#1a1b1e",
  },
  secondary: {
    main: "#98f5e1",
    contrastText: "#1a1b1e",
  },
  background: {
    default: "#FBF8CC",
    paper: "#98f5e1",
    nav: "#b4d4ff",
  },
  text: {
    primary: "#1a1b1e",
    secondary: "#4a4b4d",
  },
}

// Updated dark theme colors
const darkPalette = {
  mode: "dark",
  primary: {
    main: "#3b82f6", // Vibrant blue
    light: "#60a5fa",
    dark: "#2563eb",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#1f2937", // Rich dark blue-gray
    light: "#374151",
    dark: "#111827",
    contrastText: "#ffffff",
  },
  background: {
    default: "#111827", // Darker background
    paper: "#1f2937", // Card background
    nav: "#1f2937",
  },
  text: {
    primary: "#ffffff",
    secondary: "#9ca3af",
  },
}

// Common theme settings
const commonSettings = {
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "30px",
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#2563eb",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(59, 130, 246, 0.1)",
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
}

export const theme = createTheme({
  ...commonSettings,
  palette: lightPalette,
})

export const darkTheme = createTheme({
  ...commonSettings,
  palette: darkPalette,
})

