import './theme/app.scss'

import { createApp } from 'vue'

import { Component, Hook, VueComponent } from 'vue3-oop'
import Taro from '@tarojs/taro'
import { CountService } from '@/service/count.service'
import { setup } from '@/setup'

// 全局服务通过根组件注入
@Component({ providers: [CountService] })
class App extends VueComponent {
  @Hook('Mounted')
  mounted() {
    Taro.showToast({ title: 'mounted', duration: 3000 })
  }
}

const app = createApp(App)
setup(app)
export default app
