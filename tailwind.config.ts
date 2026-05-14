import type { Config } from "tailwindcss"

// Paleta Voz Inata — derivada do brand book "inata · conexão, presença e alma"
// (substitui a paleta verde/terracota antiga).
// Os nomes legados (verde, terracota, areia, salvia, etc.) foram preservados
// para não quebrar classes existentes; cada um aponta agora para a cor
// equivalente na nova paleta lilás/menta/lavanda.

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
        // ── Nova paleta semântica ────────────────────────────────────
        lilas: {
          DEFAULT: "#8B7FD6",
          50:  "#F4F1FC",
          100: "#E5DCFA",
          200: "#CFC0F2",
          300: "#B8A8E8",
          400: "#A491DE",
          500: "#8B7FD6",
          600: "#7368C0",
          700: "#5B4FA8",
          800: "#3E3375",
          900: "#2A2354"
        },
        menta: {
          DEFAULT: "#A8D9A8",
          50:  "#F0FAF0",
          100: "#D6F0D6",
          200: "#A8D9A8",
          400: "#7BC27B",
          600: "#4E9E4E"
        },
        lavanda: "#D8CCF5",
        orbe: "#B8A8E8",

        // ── Aliases legados → remapeados para a nova marca ──────────
        verde: {
          DEFAULT: "#3E3375",      // títulos e nav (era #2F4A3A)
          50:  "#F4F1FC",
          100: "#E5DCFA",
          200: "#CFC0F2",
          300: "#B8A8E8",
          400: "#7368C0",
          500: "#5B4FA8",
          600: "#3E3375",
          700: "#2A2354",
          800: "#1C1840",
          900: "#100D26"
        },
        terracota: {
          DEFAULT: "#8B7FD6",      // CTAs (era #C97B5C)
          50:  "#F4F1FC",
          100: "#E5DCFA",
          200: "#CFC0F2",
          300: "#B8A8E8",
          400: "#A491DE",
          500: "#7368C0",
          600: "#5B4FA8",
          700: "#3E3375",
          800: "#2A2354",
          900: "#1C1840"
        },
        areia: "#E5DCFA",          // bg suave (era #E8D9C7)
        salvia: "#A8D9A8",          // verde menta (era #A6BFA4)
        creme: "#FAFAFE",          // base (era #FAF6F0)
        tinta: "#0F0E1A",          // texto principal (era #1E1A17)
        argila: "#6E6B85",          // texto secundário (era #6B635A)
        ambar: "#D49A4C",          // mantém alerta
        vinho: "#8B3A66"           // mantém erro (ajustado para harmonizar)
      },
      fontFamily: {
        // Manrope substitui Fraunces como display geométrica grotesca.
        // Inter segue como sans para corpo. Caveat para acentos manuscritos.
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"]
      },
      borderRadius: {
        lg: "14px",
        xl: "20px",
        "2xl": "28px"
      },
      keyframes: {
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "orb-float": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%":     { transform: "translate(-20px, 20px) scale(1.05)" }
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 700ms ease-out both",
        "orb-float":  "orb-float 14s ease-in-out infinite"
      }
    }
  },
  plugins: []
}

export default config
