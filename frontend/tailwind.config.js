/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./node_modules/flowbite-react/**/*.js"],
  plugins: [require("flowbite/plugin")],
  future: {
    // この行を追加
    hoverOnlyWhenSupported: true,
  },
  // この設定を追加
  experimental: {
    disableColorOpacityUtilitiesByDefault: true,
  },
  theme: {
    extend: {
      transitionDuration: {
        950: "950ms",
      },
    },
  },
};
