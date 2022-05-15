module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  pwa: {
    manifestOptions: {
      icons: [
        {
          'src': './images/icons/android-chrome-192x192.png',
          'sizes': '192x192',
          'type': 'image/png'
        },
        {
          'src': './images/icons/android-chrome-512x512.png',
          'sizes': '512x512',
          'type': 'image/png'
        },
        {
          'src': './images/icons/android-chrome-maskable-192x192.png',
          'sizes': '192x192',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': './images/icons/android-chrome-maskable-512x512.png',
          'sizes': '512x512',
          'type': 'image/png',
          'purpose': 'maskable'
        }
      ],
    },
    iconPaths: {
      favicon32: 'images/icons/favicon-32x32.png',
      favicon16: 'images/icons/favicon-16x16.png',
      appleTouchIcon: 'images/icons/apple-touch-icon-152x152.png',
      maskIcon: 'images/icons/safari-pinned-tab.svg',
      msTileImage: 'images/icons/msapplication-icon-144x144.png'
    }
  }
}
