import { Configuration } from '@nuxt/types'

// import colors from 'vuetify/es5/util/colors'

const config: Configuration = {
  mode: 'spa',
  srcDir: 'resources/nuxt',

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '@/plugins/vee-validate' },
    { src: '@/plugins/vue-long-click' }
  ],

  /*
   ** Nuxt.js build modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
    // '@nuxtjs/vuetify'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    'nuxt-laravel',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},

  // typescript: {
  //   typeCheck: {
  //     eslint: true
  //   }
  // },

  router: {
    base: '/app/'
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // extend(config, ctx) {}
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}

export default config
