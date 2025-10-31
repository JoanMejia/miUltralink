// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-29',
  devtools: { enabled: true },
  // modules: ['@nuxt/ui','@nuxt/content'],
    modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
   runtimeConfig: {
    // Variables privadas del servidor
    mongodbUri: process.env.MONGODB_URI,// Accedida como: useRuntimeConfig().mongodbUri
  },
})