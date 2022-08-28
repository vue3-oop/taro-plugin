/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Button } from '@tarojs/components'
import Taro, {useLoad} from '@tarojs/taro'
import { SkipSelf } from 'injection-js'
import { Component, Hook, Link, Mut, VueComponent } from 'vue3-oop'
import { CountService } from '@/service/count.service'
import { MiniHook } from '@vue3-oop/taro-hooks'

@Component()
export default class Index extends VueComponent {
  constructor(@SkipSelf() private countService: CountService) {
    super()
  }

  goCount = () => {
    Taro.navigateTo({ url: '/pages/sub/count/index' })
  }

  @Mut() checked = false

  @Link() btn: InstanceType<typeof Button>

  @MiniHook('Load')
  load() {
    console.log('load miniapp')
  }

  render() {
    const { countService } = this
    return (
      <>
        <h2>当前数字： {countService.count}</h2>
        <Button loading type={'primary'} onClick={countService.add} disabled>
          加
        </Button>
        <Button type={'primary'} onClick={countService.remove}>
          减
        </Button>
        <Button ref="btn" onClick={this.goCount}>跳转下一个页面再返回查看</Button>
      </>
    )
  }
}
