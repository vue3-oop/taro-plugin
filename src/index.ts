import path from 'path'
import type { IPluginContext } from '@tarojs/service'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

export interface Vue3OOPTaroPluginConfig {
  /** 类型检查 */
  typeCheck?: boolean
}

export default (ctx: IPluginContext, config: Vue3OOPTaroPluginConfig) => {
  const { framework } = ctx.initialConfig
  if (framework !== 'vue3')
    return
  const isH5 = process.env.TARO_ENV === 'h5'
  const isDev = process.env.NODE_ENV === 'development'
  const cwd = process.cwd()
  // 修改webpack配置
  ctx.modifyWebpackChain(({ chain }) => {
    if (isH5) {
      chain.plugin('htmlWebpackPlugin')
        .tap((args: any) => {
          args[0].template = path.resolve(cwd, 'public/index.html')
          return args
        })
    }

    // add ts
    chain.merge({
      module: {
        rule: {
          script: {
            test: /\.m?jsx?$/,
          },
          ts: {
            test: /\.tsx?$/,
            use: {
              babelLoader: {
                loader: require.resolve('babel-loader'),
                options: {
                  compact: false,
                },
              },
              tsloader: {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                },
                after: 'babelLoader',
              },
            },
          },
        },
      },
    })

    // h5 add hot reload
    if (isH5 && isDev) {
      chain.merge({
        module: {
          rule: {
            ts: {
              use: {
                hotLoader: {
                  loader: require.resolve('@vue3-oop/jsx-hot-loader'),
                  after: 'tsloader',
                },
              },
            },
          },
        },
      })
    }

    // add ts check
    if (config.typeCheck !== false) {
      chain.plugin('forkTsCheckerPlugin')
        .use(ForkTsCheckerWebpackPlugin)
    }
  })
}
