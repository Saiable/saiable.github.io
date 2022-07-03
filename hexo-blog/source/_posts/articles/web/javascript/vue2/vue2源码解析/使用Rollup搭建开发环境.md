---
title: 使用Rollup搭建开发环境
date: 2022-7-1 17:24:41
cover: false
tags:
  - Vue
  - 源码
  - 环境搭建
---
# 使用`Rollup`搭建开发环境

不是重点，只会搭建最简单的环境方便编写`vue`代码

一般类库的打包，会用`rollup`，打包的体积相较`webpack`会更小，因为`rollup`更专注一些，主要用来打包`js`

新建文件夹`VUE2-STAGE`

```bash
npm init
# 一路回车

npm i rollup rollup-plugin-babel @babel/core @babel/preset-env -D

# 安装rollup
npm i rollup 

# 安装babel，将高级语法转换成低级语法
npm i rollup-plugin-babel

# 安装babel的核心模块
npm i @babel/core

# 安装预设(比如说怎么把let、const转换成var)
npm i @babel/preset-env

```

实操注意点：

提示`rollup-plugin-babel`不更新维护了

```bash
[root@VM-4-12-centos VUE2_STAGE]# npm i rollup rollup-plugin-babel @babel/core @babel/preset-env -D
npm WARN deprecated rollup-plugin-babel@4.4.0: This package has been deprecated and is no longer maintained. Please use @rollup/plugin-babel.
```

解决办法：

卸载`rollup-plugin-babel`：

```bash
npm uninstall rollup-plugin-babel
```

安装推荐的包

```bash
npm i @rollup/plugin-babel -D
```

安装完毕后的包信息：

```json
{
  "name": "vue2_stage",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.18.6",
    "@babel/preset-env": "^7.18.6",
    "@rollup/plugin-babel": "^5.3.1",
    "rollup": "^2.75.7"
  }
}

```

根目录`VUE2-STAGE`新建`rollup`配置文件`rollup.config.js`

```js
// rollup 默认可以导出一个对象，作为打包的配置文件

import babel from  '@rollup/plugin-babel'
export default {
    input: './src/index.js', // 入口
    output: {
        file: './dist/vue.js', // 出口
        name: 'Vue', // 在global全局上，增添一个Vue对象，我们就可以new Vue了（global.Vue）
        format: 'umd', // options: 1.esm es6模块，相当于没有打包了 2.commonjs node中使用 3.iife 自执行函数 4.umd 兼容amd和commonjs
        sourcemap: true // 可以调试源代码
    },
    plugins: [
        // 需要新建babel的配置文件，既可以是js文件，也可以是.rc文件,
        // 这里和视频的保持一致
        babel({
            exclude: 'node_modules/**', // 排除第三方模块 ，**表示任意文件夹
            babelHelpers: 'bundled' // https://www.npmjs.com/package/@rollup/plugin-babel  搜索babelHelpers 
        }) // 所有的插件都是函数
    ]
}
```



根目录新建`.babelrc`文件

```json
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

配置较少的话，也可以直接写在`rollup.config.js`中



在`package.json`中添加`npm run dev`脚本

`-c`：指定默认的配置文件

`-w`：监视文件变化

```json
// ...
  "scripts": {
    "dev": "rollup -cw"
  },
// ...
```



根目录新建打包入口文件`src/index.js`

```js
export const a = 100
export default {
    a: 1
}

```



测试能否打包

```bash
npm run dev
```

成功显示如下信息

```bash
[root@VM-4-12-centos VUE2_STAGE]# npm run dev

> vue2_stage@1.0.0 dev
> rollup -cw
rollup v2.75.7
bundles ./src/index.js → dist/vue.js...
created dist/vue.js in 304ms

[2022-06-30 17:36:35] waiting for changes...

```

根目录下会生成之前配置的目录及文件夹

```bash
[root@VM-4-12-centos VUE2_STAGE]# tree ./dist/
./dist/
|-- vue.js
`-- vue.js.map
```



`index.js`对应的打包文件

```js
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
})(this, (function (exports) { 'use strict';

    var a = 100;
    var index = {
      a: 1
    };

    exports.a = a;
    exports["default"] = index;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=vue.js.map

```



可以新建`index.html`并引入该打包文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
<script src="vue.js"></script>
<script>
  console.log(Vue)
</script>
</body>
</html>
```

全局上多了一个`Vue`的对象，升上的属性就是我们导出的，效果如下：

![image-20220630185136069](vue2源码.assets/image-20220630185136069.png)



`index.js`中也可以设置断点，进行调试

```js
export const a = 100
debuger
export default {
    a: 1
}
```


