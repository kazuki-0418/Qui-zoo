module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("flowbite/plugin")],
  theme: {
    extend: {
      transitionDuration: {
        950: "950ms",
      },
    },
  },
};
