# 安装依赖

依赖分为两部分，第一部分是公共依赖，第二部分是特有依赖。

## 公共依赖

公共依赖指的是为所有子包共享的包，例如：eslint、typescript 或者 prettier 等等。

# 在根目录安装 eslint 和 typescript

$ pnpm install eslint typescript --save-dev

当执行以上命令后，控制台会报如下错误：

$ pnpm install eslint typescript --save-dev
 ERR_PNPM_ADDING_TO_ROOT  Running this command will add the dependency to the workspace root,
which might not be what you want - if you really meant it, make it explicit by running this command again with the -w flag (or --workspace-root).
If you don't want to see this warning anymore, you may set the ignore-workspace-root-check setting to true.

上面的意思时：如果我们确定要安装的依赖包需要安装到根目录，那么需要我们添加-w 参数，因此修改我们的命令如下：

# 在根目录安装 eslint 和 typescript

$ pnpm install eslint typescript --save-dev -w

## 特有依赖

现在，假设我们有这样一个场景：

packages/shared 依赖包有：lodash。
packages/reactivity 依赖包有：@MyVue/shared。
packages/compiler 依赖包有：@MyVue/shared 和 @MyVue/reactivity
基于以上场景，我们该如何添加特有依赖？

给 packages/shared 添加依赖：

-r 表示在 workspace 工作区执行命令，--filter xxx 表示指定在哪个包下执行。

```
$ pnpm install lodash -r --filter @MyVue/shared
```

给 packages/reactivity 添加依赖：

```
$ pnpm install @MyVue/shared -r --filter @MyVue/reactivity
```

添加完毕后，可以在 packages/reactivity 目录下的 package.json 文件看到如下 dependencies 信息：

```
"dependencies": {
  "@MyVue/shared": "workspace:^1.0.0"
}
```

因为@MyVue/shared 属于本地包依赖，所以带有前缀 workspace。

同样的道理，当我们在 packages/compiler 安装完依赖后，可以在 package.json 文件中看到如下 dependencies 信息：

```
"dependencies": {
  "@MyVue/reactivity": "workspace:^1.0.0",
  "@MyVue/shared": "workspace:^1.0.0"
}
```

# 进行 rollup 打包

```
-D是--save-dev的缩写，表示依赖安装到devDependencies上，-w是pnpm的参数，表示依赖安装到根目录。
```

```
# 安装rollup
$ pnpm install rollup -D -w

# 安装rollup插件
$ pnpm install @rollup/plugin-json@4.1.0 @rollup/plugin-node-resolve@13.0.6 -D -w

# 安装execa
$ pnpm install execa@5.1.1 -D -w
```

rollup 是一个类似于 webpack 的打包工具，如果你还不是特别了解 rollup，你可以点击 Rollup 官网去了解更多。
@rollup/plugin-json 是一个能让我们从 json 文件中导入数据的插件。
@rollup/plugin-node-resolve 是一个能让我们从 node_modules 中引入第三方模块的插件。
execa 是一个能让我们手动执行脚本命令的一个工具。

# 打包

因为我们 packages 目录下可能会存在很多个子包，所以我们需要为每一个子包都执行一次打包命令，并输出 dist 到对应的目录下。

基于以上问题，我们将可能面临的问题进行拆分：如何准确识别出所有的子包？

可以采用 Node 中的 fs 模块去读 packages 目录下的所有子文件夹/文件，然后保留所有文件夹就是我们的所有子包，实现代码如下：

```
const fs = require('fs')

const pkgs = fs.readdirSync('packages').filter(p => {
  return fs.statSync(`packages/${p}`).isDirectory()
})

```

如何使用 execa 进行一次打包命令？

```
const build = async (pkg) => {
  await execa('rollup', ['-c', '--environment', `TARGET:${pkg}`], { stdio: 'inherit' })
}
build('shared')
```

以上 execa 执行的命令，相当于：

```
$ rollup -c --environment TARGET:shared
```

命令解读：-c 代表制定 rollup 配置文件，如果其后没有跟文件名，则默认取根目录下的 rollup.config.js 文件。--environment 表示注入一个环境变量，在我们的打包命令中注入了一个 TARGET，可以使用 process.env.TARGET 取出来，其值为 shared。

如何批量执行打包命令？
有了 shared 的打包经验，我们就可以实现给所有子包都打包，其实现代码如下：

```
  const fs = require('fs')

  const pkgs = fs.readdirSync('packages').filter(p => {
    return fs.statSync(`packages/${p}`).isDirectory()
  })

  const runParallel = (targets, buildFn) => {
    const res = []
    for (const target of targets) {
      res.push(buildFn(target))
    }
    return Promise.all(res)
  }
  const build = async (pkg) => {
    await execa('rollup', ['-c', '--environment', `TARGET:${pkg}`], { stdio: 'inherit' })
  }
  runParallel(pkgs, build)

```
