import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#173B57",
      dark: "#102A3E",
      light: "#315B77",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#C6A15B",
      dark: "#A9823E",
      light: "#D9BD84",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#17202A",
      secondary: "#667085",
    },

    success: {
      main: "#17875D",
    },

    warning: {
      main: "#E69B32",
    },

    error: {
      main: "#D64545",
    },

    info: {
      main: "#377DFF",
    },
  },

  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "none",
          paddingLeft: 18,
          paddingRight: 18,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 2px 10px rgba(16, 24, 40, 0.05)",
          border: "1px solid #EAECF0",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
  },
});
