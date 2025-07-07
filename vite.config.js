import { defineConfig } from 'vite';

export default defineConfig({
    base: '/', // base path
    build: {
        outDir: 'dist',  // where Vercel looks by default
        assetsDir: 'assets', // optional: keeps assets organized
        emptyOutDir: true
    }
});