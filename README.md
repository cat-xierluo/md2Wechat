# md2wechat

> 基于 [note-to-mp](https://github.com/sunbooshi/note-to-mp) 精简的微信公众号渲染插件

一个 Obsidian 插件，用于将笔记复制到微信公众号编辑器，同时保留样式。

## 功能

- **动态 SVG 渲染** - 支持远程 SVG URL 自动转换为内联 SVG
- **代码高亮** - 内置 10 种常用代码高亮主题（Monokai、GitHub、Dracula 等）
- **Callout 支持** - 支持 Obsidian 的 Callout 语法
- **文件嵌入** - 支持 `![[file.md]]`、`![[file.md#标题]]`、`![[file.md#^段落]]`
- **主题系统** - 自动扫描 `assets/themes/` 目录下的 CSS 文件，即放即用
- **导出 HTML** - 方便排查格式问题

## 安装

1. 使用 BRAT 插件安装：仓库地址填 `cat-xierluo/md2wechat`
2. 或手动安装：将插件文件夹复制到 `.obsidian/plugins/md2wechat/`

## 使用

1. 点击左侧工具栏图标或 `Ctrl+P` 搜索"md2wechat"
2. 选择主题和代码高亮样式
3. 点击"复制"按钮
4. 到微信公众号编辑器粘贴

## 主题

将 CSS 文件放到 `.obsidian/plugins/md2wechat/assets/themes/` 目录，插件会自动加载。

## 反馈

问题和建议请提交 [GitHub Issue](https://github.com/cat-xierluo/md2wechat/issues)。
