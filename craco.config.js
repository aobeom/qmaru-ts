const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#613d8e',
              '@text-color': '#b6abbf', // 主文本色
              '@text-color-secondary': '#7e5ea1', // 次文本色
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
