const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#3C2F41',
              '@text-color': '#986DB2', // 主文本色
              '@text-color-secondary': '#B28FCE', // 次文本色
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  runtimeCaching: [
    {
      urlPattern: '/index.html',
      handler: 'networkOnly',
    }
  ],
};
