/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tk: {
          green: "#58CC02",
          greenDark: "#46A302",
          greenLight: "#D7FFB8",
          blue: "#1CB0F6",
          blueDark: "#1899D6",
          blueLight: "#DDF4FF",
          orange: "#FF9600",
          orangeLight: "#FFF4E5",
          purple: "#CE82FF",
          purpleLight: "#F3E8FF",
          red: "#FF4B4B",
          redLight: "#FFEBEB",
          background: "#F7F7F7",
          surface: "#FFFFFF",
          border: "#E5E5E5",
          text: "#3C3C3C",
          textSecondary: "#777777",
          textMuted: "#AFAFAF",
        }
      },
      fontFamily: {
        display: ["Fredoka", "Cairo", "sans-serif"],
        body: ["Fredoka", "Cairo", "sans-serif"],
      },
      boxShadow: {
        neo: "0 4px 0 0 #E5E5E5",
        neoGreen: "0 4px 0 0 #46A302",
        neoBlue: "0 4px 0 0 #1899D6",
        neoOrange: "0 4px 0 0 #E68600",
        neoRed: "0 4px 0 0 #EA2B2B",
      }
    },
  },
  plugins: [],
}
