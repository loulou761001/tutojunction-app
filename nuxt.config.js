export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  ssr: true,
  target: 'static',
  head: {
    title: 'tj_app',
    htmlAttrs: {
      lang: 'en',
    },

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '@/assets/scss/global.scss',
    '@/assets/scss/wysiwyg.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/fontawesome.js',
    '~/plugins/utils.js',
    '~/plugins/users.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/style-resources',
  ],
  styleResources: {
    scss: ['~/assets/scss/variables.scss'],
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/dotenv',
    'nuxt-breakpoints',
    '@nuxtjs/axios',
    '@nuxtjs/universal-storage',
    '@nuxtjs/auth-next',
  ],
  storage: {},
  axios: {
    baseURL: 'http://localhost:1337', // Used as fallback if no runtime config is provided
  },
  router: {
    middleware: ['auth'],
  },
  auth: {
    strategies: {
      local: {
        token: {
          prefix: '_token.',
          global: true,
          maxAge: 86400,
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: true,
        },

        endpoints: {
          login: { url: '/users/login', method: 'post' },
          logout: { url: '/users/logout', method: 'post' },
          user: { url: '/users/me', method: 'get' },
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['defu'],
  },
}
