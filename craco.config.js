const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#9604ba',
              '@text-color': '#320047', // 主文本色
              '@text-color - secondary': '#710094', // 次文本色
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
