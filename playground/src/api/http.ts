import axios from 'axios'
import taroAdapter from '@vue3-oop/taro-axios-adapter'

export const http = axios.create({
  baseURL: 'http://localhost:9527/api',
  adapter: taroAdapter
})
