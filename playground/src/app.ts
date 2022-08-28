import '@abraham/reflection'
import './theme/app.scss'
import {http} from '@/api/http'

import { createApp } from 'vue'

import { Component, Hook, VueComponent } from 'vue3-oop'
import { CountService } from '@/service/count.service'
import { setup } from '@/setup'

http.get('/abc').then(res => {
  console.log(res)
})

// 全局服务通过根组件注入
@Component({ providers: [CountService] })
class App extends VueComponent {
  @Hook('Mounted')
  mounted() {
    console.log('app mounted')
  }
}

const app = createApp(App)
setup(app)
export default app
