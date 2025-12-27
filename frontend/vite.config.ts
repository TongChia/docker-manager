import {defineConfig} from 'vite'
import tailwindcss from "@tailwindcss/vite";
import preact from '@preact/preset-vite'
import wails from "@wailsio/runtime/plugins/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), preact(), wails("./bindings")],
})
