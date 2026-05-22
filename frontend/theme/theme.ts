/**
 * MUI Theme — SkillBridge AI
 * Premium dark/light theme with electric blue + cyan palette
 */
import { createTheme, alpha } from "@mui/material/styles";

// Brand palette
const brand = {
  navy: "#0A0F1E",
  navyLight: "#0F1629",
  blue: "#3B82F6",
  blueDark: "#2563EB",
  cyan: "#06B6D4",
  emerald: "#10B981",
  purple: "#8B5CF6",
  pink: "#EC4899",
  amber: "#F59E0B",
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: brand.blue,
      dark: brand.blueDark,
      light: "#60A5FA",
      contrastText: "#ffffff",
    },
    secondary: {
      main: brand.cyan,
      light: "#67E8F9",
      contrastText: "#ffffff",
    },
    success: { main: brand.emerald },
    warning: { main: brand.amber },
    error: { main: "#EF4444" },
    background: {
      default: brand.navy,
      paper: brand.navyLight,
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#94A3B8",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { color: "#94A3B8" },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `linear-gradient(135deg, ${brand.navy} 0%, #0D1117 100%)`,
          minHeight: "100vh",
          scrollbarWidth: "thin",
          scrollbarColor: `${brand.blue} transparent`,
        },
        "*::-webkit-scrollbar": { width: "6px" },
        "*::-webkit-scrollbar-thumb": {
          background: brand.blue,
          borderRadius: "3px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({
          ownerState,
        }: {
          ownerState: { variant?: string; color?: string };
        }) => ({
          borderRadius: 10,
          padding: "10px 24px",
          fontSize: "0.9rem",
          transition: "all 0.2s ease",
          ...(ownerState.variant === "contained" &&
            ownerState.color === "primary" && {
              background: `linear-gradient(135deg, ${brand.blue}, ${brand.blueDark})`,
              boxShadow: `0 4px 24px ${alpha(brand.blue, 0.4)}`,
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: `0 6px 32px ${alpha(brand.blue, 0.6)}`,
              },
            }),
          ...(ownerState.variant === "outlined" &&
            ownerState.color === "primary" && {
              borderColor: alpha(brand.blue, 0.5),
              "&:hover": {
                background: alpha(brand.blue, 0.1),
                borderColor: brand.blue,
              },
            }),
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${alpha(brand.navyLight, 0.8)}, ${alpha(brand.navyLight, 0.95)})`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha("#fff", 0.08)}`,
          borderRadius: 16,
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: alpha(brand.blue, 0.3),
            transform: "translateY(-2px)",
            boxShadow: `0 16px 48px ${alpha(brand.blue, 0.15)}`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            background: alpha("#fff", 0.04),
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(brand.blue, 0.5),
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: brand.blue,
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
        colorPrimary: {
          background: alpha(brand.blue, 0.15),
          color: brand.blue,
          border: `1px solid ${alpha(brand.blue, 0.3)}`,
        },
        colorSuccess: {
          background: alpha(brand.emerald, 0.15),
          color: brand.emerald,
          border: `1px solid ${alpha(brand.emerald, 0.3)}`,
        },
        colorWarning: {
          background: alpha(brand.amber, 0.15),
          color: brand.amber,
          border: `1px solid ${alpha(brand.amber, 0.3)}`,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 10, height: 8, background: alpha("#fff", 0.08) },
        bar: { borderRadius: 10 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          background: alpha(brand.navyLight, 0.9),
          border: `1px solid ${alpha("#fff", 0.06)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: `linear-gradient(180deg, ${brand.navy} 0%, ${brand.navyLight} 100%)`,
          border: "none",
          borderRight: `1px solid ${alpha("#fff", 0.06)}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `${alpha(brand.navy, 0.85)}`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha("#fff", 0.06)}`,
          boxShadow: "none",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: "2px 8px",
          "&.Mui-selected": {
            background: alpha(brand.blue, 0.15),
            color: brand.blue,
            "& .MuiListItemIcon-root": { color: brand.blue },
            "&:hover": { background: alpha(brand.blue, 0.2) },
          },
          "&:hover": { background: alpha("#fff", 0.06) },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { background: alpha("#fff", 0.08), borderRadius: 8 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: "none",
          fontSize: "0.9rem",
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: brand.blue },
    secondary: { main: brand.cyan },
    success: { main: brand.emerald },
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    text: { primary: "#0F172A", secondary: "#64748B" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: { borderRadius: 12 },
});

export { brand };
