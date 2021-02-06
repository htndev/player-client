module.exports = {
  runtimeCompiler: true,

  devServer: {
    port: 6060
  },

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },

  transpileDependencies: ['quasar']
};
