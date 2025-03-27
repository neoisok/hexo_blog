---
title: Snipaste + Hexo + GitHub + jsDelivr CDN 图床方案
date: 2025-03-27 16:52:33
categories:
    - 技术
    - tools
tags: [Hexo,图床]
---
完美的组合来了！你想在 **macOS** 上打造一个：

🚀 高效截图 → 自动上传 GitHub → 自动生成 CDN 图链 → Markdown 直接贴图

我为你设计了一套完整的 “Snipaste + Hexo + GitHub + jsDelivr CDN 图床方案”，让你**截图即图床，图链即插用！**

------

## ✅ 一图概览

```plain
Snipaste（截图标注）📸
   ↓（复制到剪贴板）
PicGo（自动上传）🚀
   ↓（上传到 GitHub 图床）
jsDelivr（CDN 加速）⚡
   ↓
Hexo Markdown 插图 ✅
```

------

## 🧱 你需要的工具（全免费）

| 工具         | 用途                  | 是否必须 |
| ------------ | --------------------- | -------- |
| **Snipaste** | 截图 + 标记（带贴图） | ✅        |
| **PicGo**    | 图床上传工具          | ✅        |
| **GitHub**   | 图床存储（公开仓库）  | ✅        |
| **jsDelivr** | CDN 加速 GitHub 图链  | ✅        |
| **Hexo**     | 博客系统              | ✅        |

------

## 🛠️ Step-by-Step 全流程配置

------

### 📸 Step 1：安装 Snipaste for macOS

- 官网：[https://snipaste.com](https://snipaste.com/)
- 支持快捷键截图、标注、钉图
- 设置截图快捷键（如 `⌘ + Shift + A`）

✅ **截图后可自动复制到剪贴板（设置中开启）**

------

### 🚀 Step 2：安装 PicGo + 配置 GitHub 图床

#### 安装 PicGo：

```bash
brew install --cask picgo
```

或从官网下载：https://picgo.github.io/

最近PicGo打开后一直提示安装更新的版本，于是去`gitHub`下载了最新版本，安装后打开，弹窗提示信息：`**文件已损坏，您应该将它移到废纸篓。**`

### 解决办法：

#### 1.打开终端输入

```bash
sudo xattr -d com.apple.quarantine "/Applications/PicGo.app"

# /Applications/PicGo.app 为程序安装的路径
```

#### 2.根据终端提示输入登录密码，重新打开就可以了

#### 配置图床：

打开 PicGo → 图床设置 → 选择 `GitHub 图床`，填写以下信息：

| 项目                           | 示例                                                   |
| ------------------------------ | ------------------------------------------------------ |
| 仓库名                         | `你的用户名/hexo-img`（新建公开仓库）                  |
| 分支                           | `main`                                                 |
| Token                          | GitHub Personal Access Token（含 repo 权限）           |
| 存储路径                       | `img/`（可选）                                         |
| 自定义域名（CDN）不配CDN不用写 | `https://cdn.jsdelivr.net/gh/你的用户名/hexo-img@main` |

👉 设置完成后，上传的每张图都会用 jsDelivr 加速图链 ✅

------

### 🎯 Step 3：绑定上传快捷键

- 打开 PicGo → 快捷键设置 → 设置「上传剪贴板图片」快捷键，例如：

```plain
Control + Option + P
```

------

### 🧪 Step 4：测试上传

1. 用 Snipaste 截图 + 标注，完成后复制到剪贴板
2. 按快捷键 `Ctrl + Opt + P`
3. 图片自动上传 GitHub，返回加速图链！

示例输出图链：

```markdown
![](https://cdn.jsdelivr.net/gh/yourname/hexo-img@main/img/2025-03-27-hello.png)
```

粘贴到 Hexo Markdown 即可插图！

------

## 🧠 Tips：图片更新怎么处理？

CDN 有缓存，如果你更新了图片但地址没变，可使用以下方式刷新：

| 方法     | 示例                                   |
| -------- | -------------------------------------- |
| 改文件名 | `cover-v2.png` 或 `cover-20250328.png` |
| 加参数   | `?v=2` → `cover.png?v=2`，可强制刷新   |
| 删除重传 | 直接从 GitHub 删除旧图，再上传新图     |

------

## 🧰 Bonus：图床仓库推荐结构

```plain
hexo-img/
├── img/
│   ├── 2025-03/
│   │   ├── pic-01.png
│   │   └── cover-v2.png
```

这样路径结构清晰，适合长期管理。



PicGo 支持动态路径！你可以设置路径自动按日期分类：

#### 🔧 PicGo 设置示例：

打开 PicGo → 图床设置 → GitHub 图床 → 存储路径 填写：

```plain
img/${year}-${month}/
```

上面这个方法不靠谱，需要用到一个插件[**picgo-plugin-custom-path**](https://github.com/melon95/picgo-plugin-custom-path)

**但是文件名有点长**

![](https://cdn.jsdelivr.net/gh/neoisok/assets@main/images%2F2025%2F03%2F27%2F20250327234848693-f76bf6ed2a29672c38cd6101f3aaad75.png)

文件重命名开启
<img src="https://cdn.jsdelivr.net/gh/neoisok/assets@main/images%2F2025%2F03%2F27%2F20250327234915338-5714bb2951fc86c47ab288ce853fe1fc.png" width=600>

## 📦 最终使用体验

| 动作            | 操作方式                            |
| --------------- | ----------------------------------- |
| 截图 + 标注     | 用 Snipaste `⌘ + Shift + A`         |
| 上传图床        | `Ctrl + Option + P`（剪贴板上传）   |
| 粘贴图链        | ⌘ + V 粘贴 → Hexo 文章即可显示 ✅    |
| 图链走 CDN 加速 | jsDelivr 提供全球 CDN，国内速度飞快 |

------

## ✅ 总结配置清单

| 工具         | 下载地址                                              |
| ------------ | ----------------------------------------------------- |
| Snipaste     | [https://snipaste.com](https://snipaste.com/)         |
| PicGo        | [https://picgo.github.io](https://picgo.github.io/)   |
| GitHub 图床  | [https://github.com](https://github.com/)             |
| jsDelivr CDN | [https://www.jsdelivr.com](https://www.jsdelivr.com/) |

------