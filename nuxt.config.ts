// https://nuxt.com/docs/api/configuration/nuxt-config


const ONE_DAY = 60 * 60 * 24 * 1000;
const ONE_WEEK = ONE_DAY * 7;

export default defineNuxtConfig({
  ssr: true,

  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  // sourcemap: {
  //   server: true,
  //   client: true,
  // },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
  },

  modules: ['vuetify-nuxt-module', '@nuxtjs/device', // 'nuxt-simple-sitemap',
  'nuxt-icons', // 'nuxt-simple-robots',
  '@nuxt/devtools', // 'nuxt-vite-legacy',
  'vue-yandex-maps/nuxt', 'nuxt-swiper', 'yandex-metrika-module-nuxt3', '@nuxtjs/google-fonts', '@nuxt/image'],
  googleFonts: {
    families: {
      Rubik: true,
    }
  },
  // legacy: {
  //   targets: ["chrome 69"],
  //   modernPolyfills: ['es.global-this', 'es.object.from-entries', 'es.array.flat-map', 'es.array.flat', 'es.array.at']
  // },
  yandexMaps: {
    apikey: '3f9c10df-563a-4f31-9dc7-32dab70c1e14',
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_var.scss" as *;',
        }
      }
    },
  },

  // yandexMetrika: {
  //   id: '96929944',
  //   clickmap:true,
  //   trackLinks:true,
  //   accurateTrackBounce:true,
  //   webvisor:true,
  //   consoleLog: false,
  //   defer: true,
  // },
  site: {
    url: 'https://aura-tour-abkhazia.ru/',
  },

  routeRules: {
    '/api/**': {cors: true},
    '/lk/**': {ssr: false},
    '/': {prerender: true},
    // '/search/city/gagra': {prerender: true},
  },


  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi-svg'
      },
      labComponents: true,
      directives: true,
    }
  },

  nitro: {
    compressPublicAssets: {
      brotli: true, gzip: true
    },
  },

  features: {
    inlineStyles: true,
    typescriptBundlerResolution: true
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      link: [
        {rel: 'apple-touch-icon', sizes: "180x180", href: '/apple-touch-icon.png'},
        {rel: 'icon', sizes: "32x32", type: 'image/png', href: '/favicon-32x32.png'},
        {rel: 'icon', sizes: "16x16", type: 'image/png', href: '/favicon-16x16.png'},
        {rel: 'icon',  type: 'image/x-icon', href: '/favicon.ico'},
        {rel: 'manifest', href: '/site.webmanifest'},
        {rel: 'mask-icon', color: "#ffffff", href: '/safari-pinned-tab.svg'},

      ],
      meta: [
        {name: "msapplication-TileColor", content: "#ffffff"},
        {name: "theme-color", content: "#ffffff"},
        {charset: 'utf-16'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {name: 'format-detection', content: 'telephone=no'},
        {
          name: 'description',
          content: 'Лучшие варианты жилья для отдыха в Абхазии в 2024 году: квартиры, коттеджи, гостевые дома, дома под ключ, отели у самого моря. Актуальные цены, проверенное жилье.'
        },

      ],
      title: 'Отдых в Абхазии 2024: цены на жилье у моря, отзывы. Снять жилье в Абхазии недорого.'
    },
  },

  // webpack: {
  //   extractCSS: true,
  //   optimization: {
  //     splitChunks: {
  //       cacheGroups: {
  //         styles: {
  //           name: 'styles',
  //           test: /\.(css|vue)$/,
  //           chunks: 'all',
  //           enforce: true
  //         }
  //       }
  //     }
  //   }
  // },

  compatibilityDate: '2024-09-19',
})