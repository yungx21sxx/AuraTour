import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

export default defineNuxtPlugin({
    name: 'calendar',
    parallel: true,
    async setup(app) {
        app.vueApp.use(VueVideoPlayer);
        app.vueApp.component('VueVideoPlayer', VueVideoPlayer);
    }
})