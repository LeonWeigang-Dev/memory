
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        settings: './html/settings.html',
        game: './html/game.html',
      },
    },
  },
});