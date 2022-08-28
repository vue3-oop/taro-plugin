import type { Hanlder } from 'vue3-oop'
import { VueComponent, VueService, createDecorator, getProtoMetadata } from 'vue3-oop'
import {
  useAddToFavorites,
  useDidHide,
  useDidShow,
  useLoad,
  useOptionMenuClick,
  usePageScroll,
  usePullDownRefresh,
  usePullIntercept,
  useReachBottom,
  useReady,
  useResize,
  useSaveExitState,
  useShareAppMessage,
  useShareTimeline,
  useTabItemTap,
  useTitleClick,
  useUnload,
} from '@tarojs/taro'

export const MiniHook: MiniHookDecorator = createDecorator('MiniHook', true)

type LifeCycle =
  | 'Load'
  | 'Ready'
  | 'DidShow'
  | 'DidHide'
  | 'Unload'
  | 'PullDownRefresh'
  | 'ReachBottom'
  | 'PageScroll'
  | 'Resize'
  | 'ShareAppMessage'
  | 'TabItemTap'
  | 'ShareTimeline'
  | 'AddToFavorites'
  | 'SaveExitState'
  | 'TitleClick'
  | 'OptionMenuClick'
  | 'PullIntercept'

interface MiniHookDecorator {
  (lifecycle: LifeCycle | LifeCycle[]): MethodDecorator
  MetadataKey: string | symbol
}

function handler(targetThis: any) {
  const list = getProtoMetadata<(LifeCycle | LifeCycle[])[]>(targetThis, MiniHook.MetadataKey)
  if (!list?.length)
    return
  for (const item of list) {
    let vueFn: any
    const doneLife: Record<string, true> = {}
    const options = item.options.slice()
    for (const option of options) {
      if (Array.isArray(option)) {
        options.push(...option)
        continue
      }
      if (doneLife[option])
        continue
      switch (option) {
        case 'Load':
          vueFn = useLoad
          break
        case 'Ready':
          vueFn = useReady
          break
        case 'DidShow':
          vueFn = useDidShow
          break
        case 'DidHide':
          vueFn = useDidHide
          break
        case 'Unload':
          vueFn = useUnload
          break
        case 'PullDownRefresh':
          vueFn = usePullDownRefresh
          break
        case 'ReachBottom':
          vueFn = useReachBottom
          break
        case 'PageScroll':
          vueFn = usePageScroll
          break
        case 'Resize':
          vueFn = useResize
          break
        case 'ShareAppMessage':
          vueFn = useShareAppMessage
          break
        case 'TabItemTap':
          vueFn = useTabItemTap
          break
        case 'ShareTimeline':
          vueFn = useShareTimeline
          break
        case 'AddToFavorites':
          vueFn = useAddToFavorites
          break
        case 'SaveExitState':
          vueFn = useSaveExitState
          break
        case 'TitleClick':
          vueFn = useTitleClick
          break
        case 'OptionMenuClick':
          vueFn = useOptionMenuClick
          break
        case 'PullIntercept':
          vueFn = usePullIntercept
          break
        default:
          // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-case-declarations
          const exhaustiveCheck: never = option
          break
      }
      doneLife[option] = true
      vueFn((...args: any[]) => targetThis[item.key](...args))
    }
  }
}

const MiniHookHandler: Hanlder = {
  key: 'MiniHook',
  handler,
}

VueComponent.handler.push(MiniHookHandler)
VueService.handler.push(MiniHookHandler)
