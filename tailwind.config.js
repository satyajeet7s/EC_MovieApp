// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./app/**/*{js,jsx,ts,tsx}"],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {
//       fontFamily: {
        
//       },
//     },
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        MomoSignatureRegular: ['MomoSignatureRegular'],
        Inter: ['Inter'],
      },
    },
  },
  plugins: [],
}