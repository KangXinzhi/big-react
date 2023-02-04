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
