const path = require('path')

const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV)

// gzip 压缩
const CompressionWebpackPlugin = require("compression-webpack-plugin")
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const name = '动森之家' // page title
// 如果端口设置为80，
// 使用管理员权限执行命令行。
// 例如，Mac: sudo npm
// 可以通过以下方法更改端口:
// port = 1019 npm run dev OR npm run dev --port = 1019
const port = process.env.port || process.env.npm_config_port || 1019 // dev port

module.exports = {
  /**
   * 如果您计划在子路径下部署站点，则需要设置publicPath，
   * 例如GitHub页面。如果您计划将您的站点部署到https://foo.github.io/bar/，
   * 那么publicPath应该设置为"/bar/"。
   * 在大多数情况下请使用'/' !!
   */
  // publicPath: '/',
  // outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: !IS_PROD,
  transpileDependencies: ["vuetify"], // 通过 Babel 显式转译哪些依赖
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://192.168.31.168:1016`,
        changeOrigin: true,
        // ws: true, // 是否启用websockets
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    sockHost: 'http://192.168.31.168:1016/'
    // after: require('./mock/mock-server.js')
  },
  configureWebpack: config => {  
    const plugins = []
    if (IS_PROD) {
      plugins.push(
        // new MiniCssExtractPlugin({        
        //   ignoreOrder: true
        // }),
        new CompressionWebpackPlugin({
          // filename: '[path][base].gz',
          filename(pathData) {
            // The `pathData` argument contains all placeholders - `path`/`name`/`ext`/etc
            // Available properties described above, for the `String` notation
            if (/\.svg$/.test(pathData.file)) {
              return 'static/svg/[path][base].gz';
            }
    
            return 'static/js/[path][base].gz';
          },
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
          //删除原始文件只保留压缩后的文件
          // deleteOriginalAssets: true
        }),
        // new BundleAnalyzerPlugin(),  
      )
    }
    config.name = name
    config.plugins = [...config.plugins, ...plugins]
  },
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true)

    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')
     
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@api", resolve("src/api"))
      .set("@components", resolve("src/components"))
      .set("@views", resolve("src/views"))
      .set("@assets", resolve("src/assets"))
      .set("@static", resolve("src/static"))
      .set("@plugins", resolve("src/plugins"))

    if(IS_PROD){
      config.module
        .rule("images")
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: [0.65, 0.9], speed: 4 },
          gifsicle: { interlaced: false }
          // webp: { quality: 75 }
        })

        // config
        //     .plugin('ScriptExtHtmlWebpackPlugin')
        //     .after('html')
        //     .use('script-ext-html-webpack-plugin', [{
        //     // `runtime` must same as runtimeChunk name. default is `runtime`
        //       inline: /runtime\..*\.js$/
        //     }])
        //     .end()

        config
          .optimization.splitChunks({
            chunks: 'all', // 若值为'async'表示只提取异步加载（即动态import()）的模块
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10, // 优先级，数字越大权重越高 
                chunks: 'initial' // 只打包最初依赖的包，即只从入口模块进行拆分
              },
              vuetify: {
                name: 'chunk-vuetify', 
                priority: 20, 
                test: /[\\/]node_modules[\\/]_?vuetify(.*)/
              },
              // viewDesign: {
              //   name: "chunk-view-design", // 单独将 view-design拆包
              //   priority: 15, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
              //   test: /[\\/]node_modules[\\/]view-design[\\/]/
              // },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // 自定义匹配规则
                minChunks: 2, //  引入的次数超过两次才被提取
                priority: 5,
                reuseExistingChunk: true // 如果当前包已经从主包里分离出来，它将被重用，而不会再次生成一个新的
              },
            }
          })
        config.optimization.runtimeChunk('single')
        // config.optimization.minimizer = [
        // ]
      }
  }
}