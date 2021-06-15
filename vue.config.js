const path = require('path')
const webpack = require('webpack')
const dayjs = require('dayjs')
const pkg = require('./package.json')
const isDev = process.env.NODE_ENV === 'development'
const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const publicPath = '/vue-typescript/'
const PORT = process.env.PORT || 3000
const cdn = {
  dev: {
    css: [],
    js: [publicPath + 'echarts4.9.0/echarts.js']
  },
  build: {
    css: [],
    js: [publicPath + 'echarts4.9.0/echarts.min.js']
  }
}

module.exports = {
  publicPath,
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    port: PORT,
    host: 'localhost',
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '/server/mock': {
        target: 'http://localhost:' + PORT,
        changeOrigin: true,
        pathRewrite: {
          '^/server/mock': '/'
        }
      },
      '/api': {
        target: 'http://115.29.224.69/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  pluginOptions: {
    // import global scss variables and mixins
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [resolve('./src/assets/styles/var.less')]
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale\/[^zh\-cn.js]$/, /moment$/)
    ]
  },
  chainWebpack(config) {
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')

    config.resolve.alias.set('vue-emoji-mart', resolve('./src/components/emoji-mart'))

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    config.plugin('html').tap(args => {
      args[0].cdn = isDev ? cdn.dev : cdn.build
      return args
    })

    config.plugin('define').tap(args => {
      // DefinePlugin 设置值 必须 JSON 序列化 或者 使用 双引号 包起来
      args[0]['process.env'].NOW = JSON.stringify(now)
      args[0]['process.env'].EMOJI_DATASOURCE_VERSION = JSON.stringify(pkg.dependencies['emoji-datasource'])
      return args
    })
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            '@primary-color': '#1890FF',
            '@menu-collapsed-width': '80px',
            '@text-color': 'rgba(0, 0, 0, .85)'
          },
          javascriptEnabled: true
        }
      }
    }
  }
}
