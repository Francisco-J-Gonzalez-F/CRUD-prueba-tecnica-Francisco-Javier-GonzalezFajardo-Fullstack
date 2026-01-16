export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  nitro: {
    compatibilityDate: "2026-01-12",
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
    },
  },

  compatibilityDate: "2026-01-12",

  typescript: {
    strict: true,
  },
});
