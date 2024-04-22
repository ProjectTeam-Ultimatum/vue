const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')  // '@' 별칭을 'src' 디렉토리로 설정
      }
    }
  }
});
