// Mirrors the "CaddyUp Colors" variables in Figma.
// Keep the names identical so design and code stay in sync.

export const light = {
  bg: "#F5F7F2", // Screen background
  surface: "#FFFFFF", // Cards, tab bar, inputs
  surfaceRaised: "#FFFFFF", // Bottom sheets, caddie panel, modals
  border: "#E5E7EB", // Dividers, outlines
  text: "#1C1C1E", // Main text
  muted: "#6B7280", // Captions, secondary text
  primary: "#1B5E20", // Buttons, active chips, green text
  onPrimary: "#FFFFFF", // Text on primary buttons
  primaryLight: "#4CAF50", // Toggles, distance bars
  tint: "#E8F5E9", // Light green panels
  accent: "#F9A825", // Highlight button (flag yellow)
  onAccent: "#0F2E14", // Text on accent buttons
  sky: "#0E87CC", // GPS dot, distance badge, avatar
  skyText: "#0A6AA1", // Small blue text, links
  skyTint: "#E4F4FD", // Info chips, tip boxes
  danger: "#D32F2F", // Errors, delete
};

// Typing dark as `Colors` forces it to have exactly the same keys as light.
// Forget one, and TypeScript flags it.
export type Colors = typeof light;

export const dark: Colors = {
  bg: "#0E1612",
  surface: "#17221B",
  surfaceRaised: "#213027",
  border: "#2C3D32",
  text: "#E8F0EA",
  muted: "#9DADA3",
  primary: "#66BB6A",
  onPrimary: "#0E1612",
  primaryLight: "#2E7D32",
  tint: "#1A2E1F",
  accent: "#F9A825",
  onAccent: "#0E1612",
  sky: "#4FB3E8",
  skyText: "#7CC8F0",
  skyTint: "#12303F",
  danger: "#EF5350",
};
