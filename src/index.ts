import * as path from 'path'
import type { IPluginContext } from '@tarojs/service'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import minimist from 'minimist'
import * as helper from '@tarojs/helper'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'

export interface Vue3OOPTaroPluginConfig {
  /** 类型检查 */
  typeCheck?: boolean
  // 环境变量前缀
  envPrifix?: RegExp
}

export default (ctx: IPluginContext, config: Vue3OOPTaroPluginConfig) => {
  const { framework, h5 } = ctx.initialConfig
  if (framework !== 'vue3')
    return
  const isH5 = process.env.TARO_ENV === 'h5'
  const isDev = process.env.NODE_ENV === 'development'
  const { appPath, sourcePath } = ctx.paths
  const BASE_URL = h5?.publicPath || '/'

  const env = loadEnv(ctx.paths.appPath, config.envPrifix)
  const envDefine: Record<string, string> = {}
  for (const key in env)
    envDefine[`process.env.${key}`] = JSON.stringify(env[key])

  env.BASE_URL = BASE_URL
  envDefine['process.env.BASE_URL'] = JSON.stringify(BASE_URL)

  // 修改webpack配置
  ctx.modifyWebpackChain(({ chain }) => {
    // 增加alias
    chain.resolve.alias.set('@', sourcePath)
    // 增加环境变量
    chain.plugin('definePlugin').tap((args: any) => {
      Object.assign(args[0], envDefine)
      return args
    })

    // 修改h5入口html
    if (isH5) {
      chain.plugin('htmlWebpackPlugin')
        .tap((args: any) => {
          args[0].template = path.resolve(appPath, 'public/index.html')
          args[0].templateParameters = env
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

export function loadEnv(envDir = process.cwd(), prefixRE = /^VUE_APP_/) {
  const { fs, printLog, processTypeEnum, createDebug } = helper
  const contextPath = envDir
  const ciArgs = minimist(process.argv.slice(2), { string: 'mode', boolean: 'watch' })

  const mode = ciArgs.mode || process.env.NODE_ENV
  process.env.VUE_APP_MODE = mode
  process.env.VUE_APP_WATCH = ciArgs.watch

  printLog(processTypeEnum.START, '读取env环境变量', mode)

  if (mode)
    load(mode)
  load()

  /**
   * 读取指定模式的配置文件中的环境变量；如果环境变量已经存在在process.env中，则不会覆盖，故此先读取的环境变量优先级更高
   */
  function load(mode?: string) {
    const logger = createDebug('taro:env')
    const basePath = path.resolve(contextPath, `.env${mode ? `.${mode}` : ''}`)
    const localPath = `${basePath}.local`

    const load = (envPath: string) => {
      try {
        if (fs.pathExistsSync(envPath)) {
          const env = dotenv.config({ path: envPath, debug: Boolean(process.env.DEBUG) })
          dotenvExpand.expand(env)
          logger(envPath, env)
        }
      }
      catch (err: any) {
        printLog(processTypeEnum.ERROR, err)
      }
    }

    load(localPath)
    load(basePath)
  }
  function resolveClientEnv() {
    const env: Record<string, any> = {}
    Object.keys(process.env).forEach((key) => {
      if (prefixRE.test(key))
        env[key] = process.env[key]
    })
    return env
  }

  return resolveClientEnv()
}
