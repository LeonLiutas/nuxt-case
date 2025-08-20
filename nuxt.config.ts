import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    typeCheck: true,
  },

  app: {
    head: {
        title: 'REBO Groep',
    }
  },

  runtimeConfig: {
    apiUrl: 'https://rebogroep.recruitee.com/api/offers/',
  },

  modules: ['@nuxt/fonts', '@nuxt/icon']
})