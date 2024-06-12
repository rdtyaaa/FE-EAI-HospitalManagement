const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.js",
    flowbite.content(),
  ],

  theme: {
    extend: {},
  },

  plugins: [require("tailwindcss"), require("postcss"), flowbite.plugin()],
};
