# 肆.1.1 深入理解 Webpack 打包

Webpack 的核心思想：**以入口模块为起点，分析依赖关系，构建模块图，再把模块和资源转换成适合部署的产物。** 只记住 `webpack.config.js` 的写法，面试时很难解释“为什么它能工作”。

## 01. Webpack 解决了什么问题？

浏览器后来支持原生 ES Modules，但生产工程仍常常需要处理 TypeScript、CSS、图片、资源指纹、兼容性与按需加载。Webpack 的工作远不只是把所有 JavaScript 粘成一个文件。

典型构建路径可以概括为：

1. 读取配置，确定入口（entry）、输出（output）和模式。
2. 从入口开始解析 `import`、`require` 等模块依赖。
3. 通过 Loader 转换相关资源，再形成模块图。
4. 经过优化、代码分割与资源生成，输出 Bundle/Chunk 等产物。
5. 通过 Plugin 在构建生命周期中实现进一步处理。

Loader 与 Plugin 的职责不同：**Loader 主要转换模块内容；Plugin 可以参与更广泛的构建流程**。

## 02. 一个最小工程

目录：

```text
my-app/
  package.json
  webpack.config.cjs
  src/index.js
```

`src/index.js`：

```javascript
import { greet } from './message.js';
console.log(greet('前端内参'));
```

`src/message.js`：

```javascript
export const greet = name => '你好，' + name;
```

`webpack.config.cjs`：

```javascript
const path = require('node:path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  }
};
```

安装 `webpack` 和 `webpack-cli` 后，运行 `npx webpack --config webpack.config.cjs`。Webpack 根据依赖图收集两个模块并生成输出文件。

## 03. 按需加载为什么能拆包？

```javascript
async function showChart() {
  const module = await import('./chart.js');
  module.renderChart();
}
```

动态 `import()` 为构建工具提供代码分割边界，但实际产物怎么划分仍取决于配置和优化策略。拆包也不是越碎越好，额外请求和运行时开销都需考虑。

## 04. Tree Shaking 为何不总生效？

所谓 Tree Shaking，是在构建阶段分析哪些导出未被使用并尝试移除。静态 ESM 依赖关系有利于分析，但**有副作用的模块不能盲删**。例如导入文件仅为了注册全局事件或样式，即使没有使用它的导出，也可能不能移除。

不要把 `mode: 'production'` 等同于“百分百移除所有无用代码”。应检查实际输出和 Bundle Analyzer 的结果。

## 05. 最常见的性能优化

- 合理拆分入口和懒加载边界，减少首屏必需下载量。
- 利用持久化缓存与稳定的资源哈希，减少重复构建和部署后的缓存失效。
- 避免庞大的转译范围和不必要的插件。
- 对第三方依赖分析体积，确认是否真正具备按需导入能力。
- 在 CI 中对生产 Bundle 大小设预算并追踪变化。

## 06. 高频问答

**Webpack 和 Vite 是一回事吗？** 不是。Webpack 是成熟的模块构建工具；Vite 在开发阶段更依赖原生 ESM，并在构建阶段使用相应工具链。两者可解决类似工程需求，但架构和体验不同。

**Module、Chunk、Bundle 怎么理解？** Module 是依赖图中的模块；Chunk 是构建过程中组织的代码块；Bundle 通常指生成并交付的资源文件。实际概念要结合构建工具输出解释。

## 参考资料

- [Webpack：Concepts](https://webpack.js.org/concepts/)
- [Webpack：Code Splitting](https://webpack.js.org/guides/code-splitting/)
- [Webpack：Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
