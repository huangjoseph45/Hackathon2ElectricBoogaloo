/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "hover:bg-blue-700",
    "hover:bg-red-700",
    "hover:bg-green-700",
    "hover:bg-purple-700",
    // Add more hover classes if needed.
  ],
  theme: {
    screens: {
      xs: "512px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {},
  },
  plugins: [],
  safelist: [
    "text-purple-300",
    "text-amber-300",
    "hover:text-purple-300",
    "hover:text-amber-400",
  ],
};
