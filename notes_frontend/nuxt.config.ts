/**
 * Nuxt configuration for Notes Organizer frontend.
 * - Provides runtimeConfig for environment-controlled settings
 * - Registers global CSS and app meta
 * - Enables permissive CORS headers for preview/local dev
 */
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Simple Notes',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      storagePrefix: process.env.NUXT_PUBLIC_STORAGE_PREFIX || 'notesapp',
      demoMode: process.env.NUXT_PUBLIC_DEMO_MODE === 'true' ? true : false
    }
  },

  app: {
    head: {
      title: 'Simple Notes',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'theme-color', content: '#1976d2' },
        { name: 'description', content: 'A modern, minimalistic notes app with folders and tags.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  css: [
    '@/assets/css/main.css'
  ],

  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  },

  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000
    }
  }
});
