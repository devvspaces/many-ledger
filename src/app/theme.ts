import { extendTheme } from "@chakra-ui/react";

// Define custom theme with dark mode preferences
export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#e6f7ff",
      100: "#b3e0ff",
      500: "#0066cc",
      600: "#0052a3",
      700: "#003d7a",
      800: "#002952",
      900: "#001429",
    },
    accent: {
      500: "#00c39a",
      600: "#00a17f",
    },
    warning: {
      500: "#ffb41d",
    },
    danger: {
      500: "#ff4d4f",
    },
  },
  styles: {
    global: (props: { colorMode: string; }) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "gray.50",
      },
    }),
  },
});
