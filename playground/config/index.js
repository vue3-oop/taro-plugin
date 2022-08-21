const path = require('path')

// 模式 区分环境
const mode = process.env.MODE || process.env.NODE_ENV || 'development'

/**
 *
 * @type {import('@tarojs/taro/types/compile').IProjectConfig}
 */
const config = {
  projectName: 'vue3taro',
  date: '2022-8-21',
  framework: 'vue3',
  compiler: {
    type: 'webpack5',
  },
  env: {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: [
    '@tarojs/plugin-html',
    '@vue3-oop/taro-plugin',
  ],
  defineConstants: {
    'process.env.MODE': JSON.stringify(mode),
  },
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sass: {
    data: '@import "@nutui/nutui-taro/dist/styles/variables.scss";',
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: false,
      },
      autoprefixer: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[local]--[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['nutui-taro'],
    postcss: {
      pxtransform: {
        enable: false,
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module',
          generateScopedName: '[local]--[hash:base64:5]',
        },
      },
    },
  },
}
module.exports = () => config
