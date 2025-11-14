import Aura from '@primeuix/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-29',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module'],
  primevue: {
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark-mode',
          cssLayer: false
        }
      }
    }
  },
  css: ['primeicons/primeicons.css', '~/assets/css/main.css', '@fortawesome/fontawesome-free/css/all.css'],
   runtimeConfig: {
    // Variables privadas del servidor
    mongodbUri: process.env.MONGODB_URI,// Accedida como: useRuntimeConfig().mongodbUri
  },
})