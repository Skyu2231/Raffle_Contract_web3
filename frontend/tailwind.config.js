/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ["Archivo", "Inter", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        fox: {
          DEFAULT: "#ff4d00",
          deep: "#d63c00",
          soft: "#fff0e6",
          tint: "#ffd9c2",
          glow: "#ff8a4c",
        },
        uni: {
          blue: "#4c82fb",
          ink: "#111110",
          surface: "#181715",
          muted: "#726c65",
          line: "#e2dcd1",
          darkline: "#2b2925",
        },
        cream: {
          DEFAULT: "#f2eee6",
          deep: "#e9e3d8",
          card: "#faf8f3",
        },
        bone: "#f2eee6",
        void: "#0b0b0a",
      },
      boxShadow: {
        card: "0 1px 0 rgba(23,19,16,0.04), 0 18px 40px -28px rgba(23,19,16,0.35)",
        "card-dark": "0 0 0 1px rgba(255,255,255,0.05)",
        float: "0 28px 70px -30px rgba(255,77,0,0.45)",
        "fox-btn": "0 10px 30px -12px rgba(255,77,0,0.7)",
        pill: "0 1px 4px rgba(23,19,16,0.06)",
      },
      borderRadius: {
        "4xl": "18px",
        "5xl": "26px",
      },
      letterSpacing: {
        tightest: "-0.055em",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(3%, -4%, 0) scale(1.08)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--tw-rotate, 0deg))" },
          "50%": { transform: "translateY(-10px) rotate(var(--tw-rotate, 0deg))" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-rev": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)" },
          "100%": { transform: "translateX(220%) skewX(-18deg)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "70%": { transform: "scale(1.9)", opacity: "0" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.94) translateY(6px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        tiltIn: {
          "0%": { opacity: "0", transform: "translateY(24px) rotateX(8deg)" },
          "100%": { opacity: "1", transform: "translateY(0) rotateX(0deg)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.15" },
        },
      },
      animation: {
        drift: "drift 20s ease-in-out infinite",
        rise: "rise 0.5s cubic-bezier(0.22,1,0.36,1) both",
        floaty: "floaty 6s ease-in-out infinite",
        "floaty-slow": "floaty 9s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        "marquee-rev": "marquee-rev 32s linear infinite",
        shimmer: "shimmer 6s linear infinite",
        sheen: "sheen 0.85s ease-out",
        "pulse-ring": "pulseRing 2.2s ease-out infinite",
        wiggle: "wiggle 4s ease-in-out infinite",
        "pop-in": "popIn 0.3s cubic-bezier(0.22,1,0.36,1) both",
        orbit: "orbit 14s linear infinite",
        "orbit-slow": "orbit 40s linear infinite",
        "tilt-in": "tiltIn 0.7s cubic-bezier(0.22,1,0.36,1) both",
        blink: "blink 1.6s steps(2, end) infinite",
      },
    },
  },
  plugins: [],
};
