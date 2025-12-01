import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import vue from '@vitejs/plugin-vue';
import AutoZip from 'vite-plugin-auto-zip';
import devtoolsJson from 'vite-plugin-devtools-json';
import { visualizer } from 'rollup-plugin-visualizer';
//import { VitePWA } from 'vite-plugin-pwa';

const __APP_VERSION__ = process.env.npm_package_version;
const __APP_NAME__ = process.env.npm_package_name;
const __APP_DESCRIPTION__ = process.env.npm_package_description;

const zipName = `${__APP_NAME__}-${__APP_VERSION__}.zip`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools({
      launchEditor: 'code',
    }),
    visualizer({
      open: true, // Automatically opens the visualizer in your browser
      filename: 'stats.html', // Output filename
      template: 'network', // Use treemap template
    }),
     visualizer({
      open: false,
      filename: 'stats_sunburst.html',
      template: 'sunburst',
    }),
    devtoolsJson({ uuid: "153818d3-0cf3-4c87-ac98-a49528d8db7a" }),
    AutoZip(zipName,'dist')
    // VitePWA({
    //   // generates 'manifest.webmanifest' file on build
    //   manifest: {
    //     // caches the assets/icons mentioned (assets/* includes all the assets present in your src/ directory)
    //     includeAssets: ["gcc.ico", "gcc192.png", "gcc256.png", "gcc512.png", "gcc.png"],
    //     name: 'Gathering Greenwood: Connecting people today with the memories of yeseterday',
    //     short_name: 'Gathering Greenwood',
    //     start_url: '/',
    //     background_color: '#15341C',
    //     theme_color: '#15341C',
    //     icons: [
    //       {
    //         "src": "gcc192.png",
    //         "type": "image/png",
    //         "sizes": "192x192"
    //       },
    //       {
    //         "src": "gcc256.png",
    //         "type": "image/png",
    //         "sizes": "256x256"
    //       },
    //       {
    //         "src": "gcc512.png",
    //         "type": "image/png",
    //         "sizes": "512x512"
    //       },
    //       {
    //         "src": "gcc.png",
    //         "type": "image/png",
    //         "sizes": "1042x1042"
    //       }
    //     ]
    //   },
    //   workbox: {
    //     // defining cached files formats
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest, json, woff, woff2, geojson, webm, webp, mp4}"],
    //   }
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@Components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@Custom': fileURLToPath(new URL('./src/components/Custom', import.meta.url)),
      '@CustomControls': fileURLToPath(new URL('./src/components/Custom/CustomControls', import.meta.url)),
      '@Composables': fileURLToPath(new URL('./src/components/Custom/CustomControls/utilities/composables', import.meta.url)),
      '@FAB': fileURLToPath(new URL('./src/components/FAB', import.meta.url)),
      '@Forms': fileURLToPath(new URL('./src/components/forms', import.meta.url)),
      '@FormsPartials': fileURLToPath(new URL('./src/components/forms/Partials/', import.meta.url)),
      '@Landing': fileURLToPath(new URL('./src/components/LandingPages', import.meta.url)),
      '@Maps': fileURLToPath(new URL('./src/components/Map', import.meta.url)),
      '@MapControls': fileURLToPath(new URL('./src/components/Map/Controls', import.meta.url)),
      '@Modals': fileURLToPath(new URL('./src/components/Modals', import.meta.url)),
      '@Search': fileURLToPath(new URL('./src/components/SearchControls', import.meta.url)),
      '@Results': fileURLToPath(new URL('./src/components/SearchResults', import.meta.url)),
      '@Utility': fileURLToPath(new URL('./src/components/Utility', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js', // Use the full build of Vue for development
    },
  },
  build: {
    cacheDir: '.vite', // Make sure the cache is stored in a persistent location
    minify: 'terser',
    terserOptions: {
      compress: {
        defaults: true,
        drop_console: ['log', 'info'], // Remove console logs and infos in production
      },
      format: {
        comments: false, // Remove comments in production
      },
    },
  },
  optimizeDeps: {
    include: [
      'map-promisified',
      '@awesome.me/kit-45e7af7a78/icons/classic/regular',
      '@awesome.me/kit-45e7af7a78/icons/duotone/regular'
    ],
  },
  server: {
    port: 5173,
    open: true,
  },
})
