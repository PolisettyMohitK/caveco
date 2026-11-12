import { defineConfig } from 'astro/config';

export default defineConfig({
  server: { port: 4321, host: true }, // host: true = reachable from phones on the same Wi-Fi
  devToolbar: { enabled: false },
});
