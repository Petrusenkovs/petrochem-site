import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Указываем, где искать классы (у вас нет папки src, поэтому пути такие)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Ваши фирменные цвета
        slate: {
          950: '#020617',
        },
        sky: {
          500: '#0ea5e9',
        },
        emerald: {
          500: '#10b981',
        },
      },
    },
  },
  plugins: [
    // Подключаем плагин для красивого текста
    require('@tailwindcss/typography'),
  ],
};
export default config;