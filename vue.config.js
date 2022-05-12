const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    host: 'localhost',
    // 设置是否启动时打开浏览器
    open: true,
    // 设置代理
    proxy: {
      // 代理的根路径
      '/': {
        ws: false, // 是否开启web socket
        target: 'http://localhost:9000', //代理的后端路径
        changeOrigin: true, //是否开启根路径转换
        // 代理路径更改
        pathReWrite:{
          '^/': '/',
        },
      },
    },
  },
})
