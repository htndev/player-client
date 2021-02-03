module.exports = {
  runtimeCompiler: true,
  devServer: {
    port: 6060
  }
  // pluginOptions: {
  //   i18n: {
  //     locale: 'en',
  //     fallbackLocale: 'en',
  //     localeDir: 'locales',
  //     enableInSFC: true
  //   },
  //   apollo: {
  //     lintGQL: true
  //   }
  // },
  // chainWebpack: config => {
  // config.module
  //     .rule('vue')
  //     .use('vue-svg-inline-loader')
  //     .loader('vue-svg-inline-loader')
  //     .end()
  //     .rule('graphql')
  //     .test(/\.(graphql|gql)$/)
  //     .use('graphql-tag/loader')
  //     .loader('graphql-tag/loader')
  //     .end();
  // }
};
