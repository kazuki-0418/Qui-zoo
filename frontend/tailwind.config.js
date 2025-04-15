const { theme } = require("flowbite-react");

module.exports = {
  content: [
    // ...
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...theme.colors,
        primary: {
          50: "#edf3ff",
          100: "#dee8ff",
          200: "#c4d3ff",
          300: "#a1b5ff",
          400: "#7b8dfe",
          500: "#5c66f8",
          600: "#403eed",
          700: "#3631d1",
          800: "#302eb8",
          900: "#2a2b85",
          950: "#1a194d",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
