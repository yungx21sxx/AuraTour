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



  sourcemap: {
    server: process.env.NODE_ENV !== "production",
    client: process.env.NODE_ENV !== "production",
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
  },

  modules: [
    'vuetify-nuxt-module',
    '@nuxtjs/device',
    'nuxt-icons',
    '@nuxt/devtools',
    'vue-yandex-maps/nuxt',
    'yandex-metrika-module-nuxt3',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],
  googleFonts: {
    families: {
      Rubik: true,
    }
  },
  sitemap: {
    xsl: false,
    cacheMaxAgeSeconds: 3600,
    sources: [
      '/api/__sitemap__/urls',
    ],
  },
  yandexMaps: {
    apikey: '3f9c10df-563a-4f31-9dc7-32dab70c1e14',
  },

  vite: {
    server: {
      watch: {
        usePolling: true, // Следит за изменениями даже если вкладка не активна
      },
      hmr: {
        overlay: false, // Чтобы не показывал ошибки поверх страницы
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vuetify')) return 'vuetify'
              if (id.includes('@videojs-player/vue') || id.includes('video.js')) return 'video'
              if (id.includes('apexcharts') || id.includes('vue3-apexcharts')) return 'charts'
              if (id.includes('v-calendar') || id.includes('@popperjs/core')) return 'calendar'
              if (id.includes('libphonenumber-js')) return 'phone-utils'
              if (id.includes('vue-draggable-next')) return 'vue-draggable-next'
              if (id.includes('swiper')) return 'swiper'
              if (id.includes('@vue')) return 'vue'
            }
          }
        }
      }
    },
    // optimizeDeps: {
    //   include: ['vuetify', 'libphonenumber-js', '@videojs-player/vue', 'apexcharts', 'vue3-apexcharts', 'v-calendar', 'video.js', '@popperjs/core', 'vue-draggable-next', 'vue-yandex-maps']
    // },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_var.scss" as *;',
        }
      }
    },
  },
  yandexMetrika: {
    id: '96929944',
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true,
    consoleLog: false,
    defer: true,
    async: true
  },
  site: {
    url: 'https://aura-tour-abkhazia.ru/',
  },
  vue: {
    propsDestructure: true
  },
  routeRules: {
    '/api/**': {cors: true},
    '/': {
      sitemap: {
        priority: 1,
        changefreq: 'monthly',
        lastmod: new Date().toISOString(),
      },
      prerender: true
    },
    '/admin/**': {sitemap: false, robots: false},
    '/search': {
      sitemap: {
        priority: 0.5,
        changefreq: 'monthly',
        lastmod: new Date().toISOString(),
      },
    },
    '/lk/**': {sitemap: false, robots: false},
    '/obrabotka-personalnyh-dannyh':{
      sitemap: {
        priority: 0.1,
        changefreq: 'yearly',
        lastmod: new Date().toISOString(),
      },
      prerender: true
    },
    '/polzovatelskoe-soglashenie': {
      sitemap: {
        priority: 0.1,
        changefreq: 'yearly',
        lastmod: new Date().toISOString(),
      },
      prerender: true
    },
    '/favorites': {sitemap: false, robots: false},
    '/about': {
      sitemap: {
        priority: 0.2,
        changefreq: 'yearly',
        lastmod: new Date().toISOString(),
      },
      prerender: true
    },
    '/contacts': {
      sitemap: {
        priority: 0.2,
        changefreq: 'never',
        lastmod: new Date().toISOString(),
      },
      prerender: true
    },
    '/help': {
      sitemap: {
        priority: 0.1,
        changefreq: 'yearly',
        lastmod: new Date().toISOString(),
      },
      prerender: true
    },
  },
  vuetify: {
    vuetifyOptions: {
      defaults: {
        VCard: {
          elevation: 0,
          variant: 'flat'
        },
        VBtn: {
          elevation: 0,
        }
      },
      icons: {
        defaultSet: 'mdi-svg'
      },
      labComponents: ['VNumberInput', 'VDateInput'],
      directives: ['Ripple'],
    },
    moduleOptions: {
      importComposables: false,
      styles: { configFile: '/assets/scss/settings.scss' }
    }
  },
  experimental: {
    inlineRouteRules: true,
  },
  nitro: {
    minify: true,
    serveStatic: false,
    compressPublicAssets: {
      brotli: true, gzip: true
    },
  },

  features: {
    inlineStyles: false,
  },
  schemaOrg: {
    defaults: false
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      titleTemplate: '%s',
      link: [
        {rel: 'apple-touch-icon', sizes: "180x180", href: '/apple-touch-icon.png'},
        {rel: 'icon', sizes: "32x32", type: 'image/png', href: '/favicon-32x32.png'},
        {rel: 'icon', sizes: "16x16", type: 'image/png', href: '/favicon-16x16.png'},
        {rel: 'icon',  type: 'image/x-icon', href: '/favicon.ico'},
        {rel: 'mask-icon', color: "#ffffff", href: '/safari-pinned-tab.svg'},
        {rel: 'manifest', href: '/site.webmanifest'},
      ],
      meta: [
        {name: "msapplication-TileColor", content: "#ffffff"},
        {name: "theme-color", content: "#ffffff"},
        {charset: 'utf-16'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {name: 'format-detection', content: 'telephone=no'},
      ],
    },
  },
  compatibilityDate: '2024-09-19',
})