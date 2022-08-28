# @vue3-oop/taro-plugin

[![NPM version](https://img.shields.io/npm/v/@vue3-oop/taro-plugin?color=a1b858&label=)](https://www.npmjs.com/package/@vue3-oop/taro-plugin)

vue3-oop的taro插件，提供了一下功能

1. 使用ts-loader编译ts
2. babel配置
3. 支持vue3-oop
4. 支持类vue-cli开发模式

## 如何使用

`taro config`里面引入

```js
{
  plugins: [
    '@vue3-oop/taro-plugin',
  ]
}
```

`babel.config.js` 里面ts设置关闭

```js
presets: [
    [
      'taro',
      {
        framework: 'vue3',
        ts: false,
      },
    ],
]
```

## 例子

在 `playground` 里面

## License

[MIT](./LICENSE) License © 2022 [agileago](https://github.com/agileago)
