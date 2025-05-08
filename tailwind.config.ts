import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#020101", // Hitam untuk border
        background: "#FFFFFF", // Putih untuk latar utama
        foreground: "#020101", // Hitam untuk teks utama
        primary: {
          DEFAULT: "#1B9C85", // Hijau Tua untuk tombol, badge, tab, ring, border
          foreground: "#FFFFFF", // Putih untuk teks pada primary
        },
        secondary: {
          DEFAULT: "#EDF6EE", // Hijau Muda untuk card, input, newsletter
          foreground: "#020101", // Hitam untuk teks pada secondary
        },
        destructive: {
          DEFAULT: "#EF4444", // Merah untuk error
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#333333", // Abu-abu untuk teks sekunder
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF", // Putih untuk dialog/popover
          foreground: "#020101", // Hitam untuk teks di popover
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(-35deg, #1B9C85 0%, #FFFFFF 50%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-in",
        "fade-out": "fade-out 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;