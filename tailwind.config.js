/** @type {import(''tailwindcss'').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const brandPalette = {
  primary: "#06b48b",
  primaryAccent: "#00c2a8",
  highlight: "#4ade80",
  surface: "#f2fbf7",
  surfaceSoft: "#e3f6ef",
  surfaceStrong: "#c3ebdc",
  neutral: "#1f2a37",
  neutralSoft: "#4b5563",
  border: "#d6ebdf",
  white: "#ffffff",
};

const brandGradients = {
  panel: `linear-gradient(180deg, ${brandPalette.surface} 0%, ${brandPalette.surfaceSoft} 45%, ${brandPalette.surfaceStrong} 100%)`,
  badge: `linear-gradient(135deg, ${brandPalette.primary} 0%, ${brandPalette.primaryAccent} 100%)`,
  highlight: `linear-gradient(135deg, ${brandPalette.highlight} 0%, ${brandPalette.primaryAccent} 100%)`,
  glow: `radial-gradient(circle at 30% 20%, ${brandPalette.primary}33 0%, transparent 55%)`,
};

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      "2xs": "320px",
      xs: "460px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1240px",
      "2xl": "1536px",
      "3xl": "1836px",
      "4xl": "2060px",
    },
    extend: {
      colors: {
        brand: {
          ...brandPalette,
        },
        primary: brandPalette.primary,
        "primary-light": `${brandPalette.primary}20`,
        secondary: brandPalette.highlight,
        "secondary-light": brandPalette.surface,
        "secondary-dark": brandPalette.primaryAccent,
        "secondary-border": `${brandPalette.primary}40`,
        label: "rgba(55, 65, 81, 0.65)",
      },
      backgroundImage: {
        "brand-panel": brandGradients.panel,
        "brand-badge": brandGradients.badge,
        "brand-highlight": brandGradients.highlight,
        "brand-glow": brandGradients.glow,
        "hero-pattern": "url(/assets/banner/bg-shape.webp)",
      },
      boxShadow: {
        "brand-card": "0 32px 80px rgba(6, 180, 139, 0.2)",
        "brand-soft": "0 24px 40px rgba(6, 180, 139, 0.14)",
      },
      gridTemplateColumns: {
        "auto-fill-100": "repeat(auto-fill, minmax(160px, 1fr))",
        "auto-fit-100": "repeat(auto-fit, minmax(100px, 1fr))",
      },
      fontFamily: {
        poppinsLight: ["Poppins-Light", "sans-serif"],
        poppinsBold: ["Poppins-Bold", "sans-serif"],
        poppins: ["Poppins-Medium", "sans-serif"],
        Roboto: ["Roboto-Medium", "sans-serif"],
        RobotoLight: ["Roboto-Light", "sans-serif"],
        RobotoBold: ["Roboto-Bold", "sans-serif"],
      },
    },
  },
  plugins: [
    // require("daisyui"),
    ({ addBase }) => {
      addBase({
        ":root": {
          "--brand-primary": brandPalette.primary,
          "--brand-primary-accent": brandPalette.primaryAccent,
          "--brand-highlight": brandPalette.highlight,
          "--brand-surface": brandPalette.surface,
          "--brand-surface-soft": brandPalette.surfaceSoft,
          "--brand-surface-strong": brandPalette.surfaceStrong,
          "--brand-neutral": brandPalette.neutral,
          "--brand-neutral-soft": brandPalette.neutralSoft,
          "--brand-border": brandPalette.border,
          "--brand-white": brandPalette.white,
          "--gradient-brand-panel": brandGradients.panel,
          "--gradient-brand-badge": brandGradients.badge,
          "--gradient-brand-highlight": brandGradients.highlight,
          "--gradient-brand-glow": brandGradients.glow,
          "--shadow-brand-card": "0 32px 80px rgba(6, 180, 139, 0.2)",
        },
      });
    },
  ],
};
