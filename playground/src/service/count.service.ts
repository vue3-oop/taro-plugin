import { Autobind, Mut, VueService } from 'vue3-oop'
import { MiniHook } from '@vue3-oop/taro-hooks'

@Autobind()
export class CountService extends VueService {
  @Mut() count = 1
  add() {
    this.count++
  }

  remove() {
    this.count--
  }
}
