import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        muted: "#475569",
        primary: "#0ea5e9"
      },
      boxShadow: {
        glass: "0 10px 30px rgba(2,6,23,.08)"
      }
    }
  },
  plugins: []
} satisfies Config; 