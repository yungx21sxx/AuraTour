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

  dir: {
    app: 'app'
  },

  runtimeConfig: {
    cookieName: process.env.COOKIE_NAME || "__session",
    cookieSecret: process.env.COOKIE_SECRET || "secret",
    cookieExpires: parseInt(process.env.COOKIE_REMEMBER_ME_EXPIRES || ONE_DAY.toString(), 10), // 1 day
    cookieRememberMeExpires: parseInt(process.env.COOKIE_REMEMBER_ME_EXPIRES || ONE_WEEK.toString(), 10), // 7 days
  },

  modules: [
    'vuetify-nuxt-module',
    '@nuxtjs/device',
    'nuxt-icons',
    '@nuxt/devtools',
    'nuxt-simple-sitemap',
    'nuxt-simple-robots',
    'vue-yandex-maps/nuxt',
    'nuxt-swiper',
    'yandex-metrika-module-nuxt3',
    // 'nuxt-vite-legacy',
  ],

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
          silenceDeprecations: ["legacy-js-api"],
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
  // },
  site: {
    url: 'https://aura-tour-abkhazia.ru/',
  },

  routeRules: {
    '/api/**': {cors: true},
    '/admin/**': {robots: false},
    '/lk/**': {ssr: false}
  },

  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      directives: ['Ripple'],
      defaults: {
        VTextField: {
          variant: 'outlined',
          density: 'comfortable'
        },
        VSelect: {
          hideDetails: true,
          variant: 'outlined',
          density: 'compact'
        },
      }
    }
  },

  nitro: {
    compressPublicAssets: {
      brotli: true, gzip: true
    },
  },

  features: {
    inlineStyles: true,
    importAttributes: true
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

  webpack: {
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
  },

  compatibilityDate: '2024-09-19',
})