import { createTheme } from "@mui/material/styles";

/**
 * Central design system for the Team Splitter admin UI.
 *
 * Goals: one clean, modern light theme shared by every page so surfaces,
 * spacing, typography and controls stay consistent. Pages should lean on
 * these defaults (and the shared layout components) instead of ad-hoc
 * inline styling.
 */

const BRAND_BLUE = "#0b74d1";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#5aa9ea",
      main: BRAND_BLUE,
      dark: "#075297",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#82e9de",
      main: "#159e91",
      dark: "#00867d",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f6f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a2430",
      secondary: "#5b6b7b",
    },
    divider: "rgba(26, 36, 48, 0.10)",
    success: { main: "#2e9e6b" },
    error: { main: "#d24b4b" },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontSize: "1.875rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontSize: "1.35rem", fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontSize: "1.15rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },
    subtitle1: { color: "#5b6b7b" },
    button: { textTransform: "none", fontWeight: 600 },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f4f6f9",
        },
      },
    },

    MuiAppBar: {
      defaultProps: {
        color: "inherit",
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1a2430",
          borderBottom: "1px solid rgba(26, 36, 48, 0.10)",
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: "1px solid rgba(26, 36, 48, 0.10)",
          borderRadius: 14,
          boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.75rem",
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
