// plugins/test-theme/src/index.ts
import { defineTheme } from "tisane";
var index_default = defineTheme({
  id: "test-theme",
  displayName: "Midnight Blue",
  version: "1.0.0",
  type: "theme",
  tokens: {
    light: {
      background: "oklch(0.97 0.01 250)",
      foreground: "oklch(0.15 0.02 250)",
      primary: "oklch(0.5 0.2 260)",
      "primary-foreground": "oklch(0.98 0 0)",
      secondary: "oklch(0.93 0.01 250)",
      "secondary-foreground": "oklch(0.2 0.02 250)",
      accent: "oklch(0.93 0.03 260)",
      "accent-foreground": "oklch(0.2 0.02 250)",
      muted: "oklch(0.95 0.01 250)",
      "muted-foreground": "oklch(0.5 0.02 250)",
      card: "oklch(0.99 0.005 250)",
      "card-foreground": "oklch(0.15 0.02 250)",
      border: "oklch(0.9 0.01 250)"
    },
    dark: {
      background: "oklch(0.12 0.02 250)",
      foreground: "oklch(0.95 0 0)",
      primary: "oklch(0.65 0.2 260)",
      "primary-foreground": "oklch(0.15 0 0)",
      secondary: "oklch(0.22 0.02 250)",
      "secondary-foreground": "oklch(0.95 0 0)",
      accent: "oklch(0.25 0.03 260)",
      "accent-foreground": "oklch(0.95 0 0)",
      muted: "oklch(0.22 0.02 250)",
      "muted-foreground": "oklch(0.65 0.01 250)",
      card: "oklch(0.18 0.02 250)",
      "card-foreground": "oklch(0.95 0 0)",
      border: "oklch(1 0 0 / 12%)"
    },
    radius: "0.75rem",
    typography: {
      "heading-1": "4rem"
    }
  }
});
export {
  index_default as default
};
