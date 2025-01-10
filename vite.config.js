import { defineConfig } from 'vite';

export default defineConfig({
  return :{
  server:{
    proxy: {
      '/': {
        target: 'http://10.98.193.46:8080',
        changeOrigin: true,
      },
    }
  }
}
});