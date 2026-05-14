import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem"
      },
      screens: {
        "2xl": "1200px"
      }
    },
    extend: {
      colors: {
        // Paleta Voz Inata — definida na Skill 04
        verde: {
          DEFAULT: "#2F4A3A",
          50: "#EEF2EE",
          100: "#D6DFD8",
          200: "#A9BDAE",
          300: "#7C9B84",
          400: "#5A7E64",
          500: "#3F624A",
          600: "#2F4A3A",
          700: "#243A2D",
          800: "#1B2C22",
          900: "#111E17"
        },
        terracota: {
          DEFAULT: "#C97B5C",
          50: "#FAF1ED",
          100: "#F2DDD0",
          200: "#E5BBA3",
          300: "#D79877",
          400: "#C97B5C",
          500: "#B96846",
          600: "#9A5538",
          700: "#76402B",
          800: "#532D1E",
          900: "#321B12"
        },
        areia: "#E8D9C7",
        salvia: "#A6BFA4",
        creme: "#FAF6F0",
        tinta: "#1E1A17",
        argila: "#6B635A",
        ambar: "#D49A4C",
        vinho: "#8B3A3A"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        lg: "14px",
        xl: "20px"
      }
    }
  },
  plugins: []
}

export default config
