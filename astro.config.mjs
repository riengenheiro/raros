import { defineConfig } from "astro/config";

export default defineConfig({
  server: {
    port: 4321,
    host: true,
  },
  // O deploy na Cloudflare usa public/_redirects (HTTP 302).
  // Esta regra faz o mesmo no `astro dev` e no preview local.
  redirects: {
    "/clube": {
      status: 302,
      destination: "/v2/?ref=S108575051Q",
    },
  },
});
