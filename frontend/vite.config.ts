import {defineConfig} from 'vite'
import tailwindcss from "@tailwindcss/vite";
import preact from '@preact/preset-vite'
import wails from "@wailsio/runtime/plugins/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), preact(), wails("./bindings")],
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                create_container: 'nested/create_container/index.html',
                remove_container: 'nested/confirm_dialog/remove_container.html',
            },
        },
    },
})
