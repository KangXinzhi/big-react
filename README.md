**day1 20230204**

# 一、搭建项目选项

## 初始化项目

用 Multi-repo 和 Mono-repo 该如何选择？

- Multi-repo 每个库有自己独立的仓库，逻辑清晰，相对应的，协同管理会更繁琐
- Mono-repo 可以很方便的协同管理不同独立的库的生命周期，相应的，会有更高的操作复杂度。

因为我们的项目有不同的包，比如 react 包、reactDom 包、react-reconciler 包、所以选择 Mono-repo 来工具。

使用 pnpm 来管理全局包
pnpm 对比其他打包工具的优势

- 依赖安装块 （link 软链接安装）
- 更规范（处理幽灵依赖问题）

```
pnpm init
新建pnpm-workspace.yaml 文件
```

## 定义开发规范

安装 eslint

```
// -w 在根目录下安装依赖
pnpm i eslint -D -w
```

```
npx eslint --init
```

安装 ts 的 eslint 插件

```
pnpm i D -w @typescript-eslint/eslint-plugin
```

代码风格：prettier

```
pnpm i prettier -D -w
```

将 prettier 集成到 eslint 中，安装两个插件

- eslint-config-prettier 覆盖 ESlint 本身的规则配置
- eslint-plugin-prettier 用 prettier 来接管修复代码

为 lint 增加对应的脚本

```
"lint": "eslint --ext .ts,.jsx,.tsx --fix --quiet ./packages"
```

commit 规范检查

```
pnpm i husky -D -w
npx husky install
// 代码风格进行检查
npx husky add .husky/pre-commit "pnpm lint"
```

```
// 对git提交信息进行检查
pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D -w

npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"
```

ts 配置  
新建 tsconfig.json

项目打包工具  
rollup

```
pnpm i -D -w rollup
```

**day2 20230205**

# 二、JSX 转换

## 2-1 实现 JSX

React 项目结构：

- react （宿主环境无关的公用方法）
- react-reconciler （协调器）
- 各种宿主环境的包
- shared （公共辅助方法，宿主环境无关）

jsx 转换属于 react 包

jsx 转换

```
// 在react17之前呢调用React.createElement方法

<div>123</div>

// babel 转换
React.createElement("div",null,123)


```

```
//在react17之后呢调用jsx-runtime方法
import { jsx as _jsx } from "react/jsx-runtime";
/*#__PURE__*/_jsx("div", {
  children: "123"
});

```

## 2-2 实现 JSX 打包

rollup plugins

```
// ts转js
pnpm install -D -w rollup-plugin-typescript2

// commonjs
pnpm install -D -w @rollup/plugin-commonjs
```

```
// 每次打包到dist之前先删除
pnpm i -D -w rimraf
```

```
// 打包文件中生产package.json
pnpm i -D -w rollup-plugin-generate-package-json
```

## 2-3 JSX 转换 - 实现第一种调试方式

使用 pnpm link 验证

1. 进入打包后 dist 的 react 文件夹中执行**pnpm link --global**，将其变成全局 pnpm 依赖的 react
2. cra 创建一个 react 项目
3. 在项目中**pnpm link react --global**

优点：可以模拟实际导入情况
缺点：略显繁琐，更期望热更新

**day3 20230207**

# 三、实现 reconciler

reconciler 是 React 的核心逻辑所在模块，中文名角协调器。协调（reconcile）就是 diff 算法的意思。

## reconciler 作用

- JQ 过程驱动 开发者=》使用 JQ=》调用宿主环境 API=》显示真实的 UI
- react/vue 状态驱动 开发者=》描述 UI（JSX/模板语法）=》框架的运行时核心模块（reconciler/renderer）=》调用宿主环境 API=》显示真实的 UI

react

- 消费 jsx
- 没有编译优化
- 开发通用的 API 供不同的宿主环境使用

核心消费 JSX 过程  
核心模块操作的数据结构是？FiberNode

ReactElement 无法成为核心模块操作的数据原因？

- 无法表达节点之间的关系
- 字段有限，不好扩展（比如：无法表达状态）

FiberNode 特点：

- 介于 ReactElement 和真实 UI 节点之间
- 能够表达节点之间的关系
- 方便扩展（不仅能作为数据存储单元，还能作为工作单元）

reconciler 的工作方式：  
对于同一个节点，比较**ReactElement**和**FiberNode**，生成子 fiberNode。并根据比较的结果生成不同标记（插入（placement），删除（Deletion），移动......），对应不同宿主环境 API 的执行。

当所有的 React Element 比较完后，会生成一颗 fiberNode 树，一共会存在两颗 fiberNode 树：

- current：与试图中真实 UI 对用的 fiberNode 树
- workInProgress：触发更新后，正在 reconciler 中计算的 fiberNode 树
  （双缓存技术）

JSX 消费的顺序：
以 DFS（深度优先遍历）的顺序遍历 ReactElement

- 如果有子节点，遍历子组件
- 如果没有子节点，遍历兄弟节点

例子

```
/**
  过程： 先遍历Card，其有子节点遍历h3，其有子节点遍历hi，hi无子节点无兄弟节点，回到h3，
  其有兄弟节点遍历p，其有子节点遍历hello，hello无子节点无兄弟节点，回到p，
  p无子节点无兄弟节点回到Card
*/
<Card>
  <h3>hi</h3>
  <p>hello</p>
</Card>
```

这是个递归的过程，存在递、归两个阶段：

- 递：对应的 beginWork
- 归：对应的 completeWork
