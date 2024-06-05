const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',
    port: process.env.PORT || 8080,
    allowedHosts: [
        'npm-container' // My Dev Environment is inside a container
    ]
  }
})
