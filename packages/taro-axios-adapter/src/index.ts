import Taro from '@tarojs/taro'
import type { AxiosRequestConfig } from 'axios'

function settle(resolve: (value: any) => void, reject: (err: any) => void, res: any, failed?: any) {
  if (!failed)
    resolve(res)
  else
    reject(res)
}

export default function taroAdapter(config: AxiosRequestConfig): any {
  return new Promise((resolve, reject) => {
    Taro.request({
      ...(config as any),
      url: (config.baseURL || '') + config.url,
      data: config.data,
      method: config.method as any,
      header: config.headers,
      timeout: config.timeout,
      success(res) {
        const response = {
          ...res,
          status: res.statusCode,
          statusText: res.errMsg,
          headers: res.header,
          config,
          request: null,
        }

        settle(resolve, reject, response)
      },
      fail(res: any) {
        const response = {
          ...res,
          status: res.statusCode,
          statusText: res.errMsg,
          headers: res.header,
          config,
          request: null,
        }

        settle(resolve, reject, response, true)
      },
    })
  })
}
