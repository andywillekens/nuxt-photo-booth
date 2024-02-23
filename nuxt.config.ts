import { resolve } from 'path'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', 'nuxt-icon'],
  alias: {
    '@': resolve(__dirname, './')
  },
  tailwindcss: {
    cssPath: '~/styles/tailwind.scss'
  },
  image: {
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    }
  }
  // app: {
  //   head: {
  //     templateParams: {
  //       separator: '-'
  //     },
  //     charset: 'utf-8',
  //     link: [
  //       { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
  //       { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }
  //     ]
  //   }
  // },
})
