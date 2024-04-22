const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = {
  devServer: {
      proxy: {
          '/api': {
              target: 'http://localhost:8081',
              changeOrigin: true,
              pathRewrite: { '^/api': '/api' }
          }
      }
  }
}
