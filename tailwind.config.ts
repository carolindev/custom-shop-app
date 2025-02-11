import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo
        accent: "#9333EA",  // Purple accent
        dark: "#1F2937",    // Gray-800
        light: "#F9FAFB",   // Gray-50
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 6px rgba(0, 0, 0, 0.1)",
        strong: "0 6px 12px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;