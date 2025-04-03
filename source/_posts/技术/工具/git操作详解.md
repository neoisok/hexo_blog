---
title: git 操作详解
date: 2025-03-27 16:52:33
categories:
    - 技术
    - tools
tags: git
---
# git清除缓存

你遇到的这个问题，是由于之前**嵌套了 git 仓库**，删除了 `themes/butterfly/.git` 后，又执行了：

```plain
git add themes/butterfly
git commit -m "添加 Butterfly 主题（非子模块）"
```

此时你的本地仓库正常了，但在 GitHub 上仍显示 Butterfly 文件夹为空，这是因为：

- Git 对嵌套仓库只保存了一个指针（子模块链接）。
- 当你删除 `.git` 文件夹后，实际上内容**并未真正提交**到远程仓库，Git 仍然只记录了主题文件夹的引用。

**出现奇怪问题之后**

- 彻底从 git 的缓存中移除旧引用。
- 然后重新执行 `git add` 和 `git commit` 提交所有文件。

```plain
git rm --cached themes/butterfly -r
git add themes/butterfly
git commit -m "重新添加 Butterfly 主题文件"
git push origin main
```



# 常用命令

------

## 🧱 一、仓库初始化 & 基础操作

```bash
git init                      # 初始化本地 Git 仓库
git clone <repo_url>         # 克隆远程仓库
git status                   # 查看当前状态（改动、未提交）
git add <file>               # 将文件加入暂存区（可以 . 表示全部）
git commit -m "备注信息"     # 提交代码并添加说明
```

------

## 🌿 二、分支操作

```bash
git branch                   # 查看本地所有分支
git branch <branch-name>     # 新建分支
git checkout <branch-name>   # 切换到分支
git checkout -b <branch-name> # 新建并切换
git merge <branch-name>      # 合并某分支到当前分支
git branch -d <branch-name>  # 删除本地分支
```

------

## 🔁 三、远程操作

```bash
git remote -v                                # 查看远程仓库地址
git remote add origin <url>                  # 添加远程仓库地址
git push origin <branch>                     # 推送当前分支到远程仓库
git pull origin <branch>                     # 拉取远程分支并合并
git fetch                                    # 拉取远程所有更新（不合并）
git push -u origin <branch>                  # 首次推送并关联分支
```

------

## 🔍 四、查看历史 & 差异

```bash
git log                          # 查看提交历史
git log --oneline --graph        # 简洁的图形化提交历史
git diff                         # 查看工作区与暂存区差异
git diff <branch1> <branch2>     # 比较两个分支差异
```

------

## 🧼 五、撤销操作（常用救命命令）

```bash
git checkout -- <file>           # 撤销对某文件的修改
git reset HEAD <file>            # 取消暂存（撤回 git add）
git reset --hard HEAD            # 撤销所有修改并恢复到最后一次提交状态 ❗危险
git clean -fd                    # 删除所有未追踪文件（慎用）
```

------

## 💥 六、冲突解决

```bash
# 出现冲突时：
# 1. 手动修改冲突文件
# 2. 然后：
git add <file>                   # 标记冲突已解决
git commit                      # 提交合并后的结果
```

------

## 🪄 七、标签（打版本）

```bash
git tag                          # 查看标签
git tag v1.0.0                   # 创建标签
git tag -d v1.0.0                # 删除标签
git push origin v1.0.0           # 推送标签
```

------

## 🔐 八、配置常用信息

```bash
git config --global user.name "Neo"
git config --global user.email "neo@example.com"
git config --global core.editor "code --wait"  # 设置默认编辑器为 VSCode
```

------

## 🧠 Bonus：推荐 Git 分支命名规范（可用于多人协作）

| 类型            | 示例                     | 用途       |
| --------------- | ------------------------ | ---------- |
| `feat/xxx`      | `feat/login-api`         | 新功能     |
| `fix/xxx`       | `fix/login-bug`          | 修复 bug   |
| `hotfix/xxx`    | `hotfix/crash-on-launch` | 紧急修复   |
| `test/xxx`      | `test/new-framework`     | 实验性分支 |
| `release/x.y.z` | `release/1.0.0`          | 预发版本   |
| `docs/xxx`      | `docs/api-readme`        | 文档修改   |

------

# cherry pick

嘿嘿 Neo，问得太准了！`cherry-pick` 是 Git 中非常实用、**但又稍微高级一点的命令**，用于把**某个提交（commit）从一个分支“精确复制”到另一个分支**。

------

## 🍒 一、什么是 `git cherry-pick`？

`git cherry-pick` 的作用是：
👉 **选择一个或多个特定提交（commit），应用到当前分支上**，而不是整个分支的 merge。

非常适用于这样的场景：

💡“我在 `dev` 分支修了一个 bug，现在想把这个修复也同步到 `release` 分支，但不想把整个 dev 分支合并过来。”

------

## ✅ 二、基本语法

```bash
git cherry-pick <commit-id>
```

比如：

```bash
git checkout release
git cherry-pick a1b2c3d4
```

这会把 `a1b2c3d4` 这个提交“复制”一份应用到 `release` 分支上。

------

## 🧩 三、进阶用法

### 1. 多个 commit 一起 cherry-pick：

```bash
git cherry-pick <commit1> <commit2> <commit3>
```

### 2. 范围 cherry-pick（不包含起始 commit）：

```bash
git cherry-pick A^..C
```

意思是：从 A 的下一个 commit 到 C（包括 C）

------

## ⚔️ 四、cherry-pick 时可能遇到冲突怎么办？

1. 如果冲突了，Git 会提示你冲突文件
2. 手动修改这些文件，解决冲突
3. 然后执行：

```bash
git add .
git cherry-pick --continue
```

1. 如果想放弃这次 cherry-pick：

```bash
git cherry-pick --abort
```

------

## 💡 五、常见使用场景总结

| 场景                                | 是否适合 cherry-pick         |
| ----------------------------------- | ---------------------------- |
| 从 `dev` 拿一个修复提交到 `release` | ✅ 非常适合                   |
| 拿多个提交跨分支迁移                | ✅ OK，但注意顺序和冲突       |
| 想同步整个分支                      | ❌ 应该用 `merge` 或 `rebase` |
| 做热修复 patch                      | ✅ 用 cherry-pick 很自然      |

------

## 👀 六、如何找 commit-id？

执行：

```bash
git log --oneline
```

或者：

```bash
git log --graph --oneline --all
```

可以看到所有提交的 ID（短哈希），然后 cherry-pick 你需要的那个。

------

## ✨ 七、IDEA 中如何 cherry-pick？

1. 打开 `Git > Log`
2. 右键某个提交 → `Cherry-pick`
3. 自动切换到当前分支并执行 cherry-pick
4. 有冲突的话 IDEA 会提示你合并

------

## ✅ 小结

| 命令                         | 作用                     |
| ---------------------------- | ------------------------ |
| `git cherry-pick <commit>`   | 把某个提交复制到当前分支 |
| `git cherry-pick --abort`    | 取消 cherry-pick 操作    |
| `git cherry-pick --continue` | 解决冲突后继续操作       |

------

# 🧠 Git 高阶命令合集（推荐收藏）

------

### 1️⃣ `git rebase`（变基）

✨ 让提交历史更干净，线性合并分支

```bash
git checkout feature
git rebase main
```

意思是：把 feature 分支的提交“搬到” main 分支后面。

配合交互式：

```bash
git rebase -i HEAD~5   # 交互式 rebase 最近 5 次提交
```

可做：

- 合并多个提交（squash）
- 修改提交说明（reword）
- 删除提交（drop）
- 改提交顺序

------

### 2️⃣ `git stash`（临时保存工作区）

🔧 当你工作一半，突然要切分支处理 bug，但又不想提交

```bash
git stash         # 保存当前改动
git stash list    # 查看所有 stash
git stash pop     # 恢复最近一次 stash 并删除
git stash apply   # 恢复但不删除
```

------

### 3️⃣ `git reflog`（Git 的后悔药）

🧠 误删分支、误 reset 后的救命命令！

```bash
git reflog
```

- 能看到所有 HEAD 的移动记录
- 例如：你误删了分支或重置了 HEAD，可以找回 commit：

```bash
git reset --hard <某个旧的commit-id>
```

------

### 4️⃣ `git reset`（强力撤销）

🚨 撤销提交、回退代码、回滚状态

```bash
git reset --soft HEAD~1     # 撤销最近一次提交（保留代码）
git reset --mixed HEAD~1    # 撤销提交+取消暂存
git reset --hard HEAD~1     # 撤销提交+取消暂存+还原代码
```

❗ `--hard` 是最危险的，别轻易动！

------

### 5️⃣ `git clean`（清理未跟踪文件）

🧹 删除所有没被 Git 跟踪的文件，比如 `.DS_Store`、缓存等

```bash
git clean -fd
```

参数说明：

- `-f` force
- `-d` 目录也删

------

### 6️⃣ `git blame`（谁改的）

🕵️ 查某一行是谁在什么时候提交的

```bash
git blame 文件名
```

也可以查某一行：

```bash
git blame -L 15,25 文件名   # 查第15到25行
```

------

### 7️⃣ `git bisect`（二分定位 bug）

🪓 自动帮你在一堆提交中定位是哪次提交引入了 bug

```bash
git bisect start
git bisect bad              # 当前是有 bug 的版本
git bisect good v1.0.0      # v1.0.0 是正常的版本
```

之后 Git 会一步步二分你历史的提交，让你判断哪个是好哪个是坏，直到定位到“坏提交”。

------

### 8️⃣ `git log` 高级玩法（格式化历史）

```bash
git log --oneline --graph --decorate --all
```

🌳 查看完整分支图，非常清晰直观：

```plain
* a1b2c3 (HEAD -> feature)
| * d4e5f6 (main)
|/
* 123abc
```

------

### 9️⃣ `git commit --amend`（修改上一次提交）

```bash
git commit --amend
```

- 修改提交说明
- 或者补加文件（漏了个文件）

------

### 🔟 `git remote prune origin`（清理无效远程分支）

🔪 删除那些远程已经删了但本地还看的见的“残影分支”

```bash
git remote prune origin
```

------

## 🚀 Bonus：别忘了 Git 的命令可以组合！

例如：

```bash
git log --author=neo --since="1 week ago" --oneline
```

看一周内 Neo 提交了什么 👀

------



Neo，这个问题问得非常到位，`.gitignore` 的行为有点“套路”，咱来给你彻底讲透 👇

------

# 😵 为什么 `.DS_Store` 已经写进 `.gitignore` 了，`git status` 里还是有？

------

### ✅ 所以有两种情况你得分清楚：

| 情况                                           | 会不会被忽略？                |
| ---------------------------------------------- | ----------------------------- |
| 文件还没被 Git 跟踪过                          | ✅ 会忽略（git status 不显示） |
| 文件 **已经被 Git 跟踪过（add 或 commit 过）** | ❌ 不会忽略，必须手动移除！    |

------

## 🔍 判断 `.DS_Store` 是否已经被 Git 跟踪：

```bash
git ls-files | grep .DS_Store
```

如果输出有 `.DS_Store`，说明它**已经被 Git 加进版本库**，就算你 `.gitignore` 了也没用。

------

## ✅ 解决方案：从 Git 跟踪中移除 `.DS_Store`

这一步可以“清洗干净”旧的 `.DS_Store`：

```bash
# 从 Git 索引中移除，但保留文件本身（不删除磁盘文件）
git rm -r --cached .DS_Store
```

如果你项目中很多地方有 `.DS_Store`，可以这么来：

```bash
find . -name .DS_Store -print0 | xargs -0 git rm --cached
```

然后：

```bash
git commit -m "chore: remove tracked .DS_Store files"
```

**之后就不会再出现在 git status 了！**

------

## ✅ 最终你需要这两件事配套完成：

### 1. `.gitignore` 文件中写：

```plain
.DS_Store
**/.DS_Store
```

### 2. 手动移除已跟踪的 `.DS_Store`：

```bash
git rm -r --cached .DS_Store
git commit -m "remove .DS_Store from repo"
```

------

# 有不同的分支，需要指定如何调和它们

以下报错解决方案

```plain
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint: 
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint: 
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
```

## 🧼 最后建议：也别让以后生成 `.DS_Store`

你可以加一个全局 `.gitignore`，让所有 Git 项目都忽略它：

```bash
git config --global core.excludesfile ~/.gitignore_global
echo ".DS_Store" >> ~/.gitignore_global
```

------



## ✅ 解决方案一：自动合并（推荐，适合大多数情况）

你可以设置默认的 pull 策略为 **merge**（合并）：

```bash
git config pull.rebase false   # 当前项目设置为 merge
# 或全局设置：
git config --global pull.rebase false
```

然后重新执行：

```bash
git pull
```

Git 会帮你合并远程分支和你的本地分支，然后你就能正常 push 了：

```bash
git push origin master
```

------

## ✅ 解决方案二：使用 `rebase`（更清爽的提交历史）

你也可以选择用 `rebase`，意思是“把你的提交放在远程的提交后面”。

```bash
git config pull.rebase true
git pull
git push origin master
```

✅ 提交历史更线性，没有多余的 merge commit
❗ 如果代码冲突，手动解决后要 `git rebase --continue`

------

## ✅ 解决方案三：强推（不建议，除非你知道你在干啥）

```bash
git push origin master --force
```

🚨 这会把远程的历史 **强制替换成你本地的版本**，可能会覆盖别人提交的内容。仅适用于你自己完全控制的分支！

------

## 🧠 小知识：为什么会 divergent？

Divergent branches 意思是：

- 你本地有提交
- 远程也有提交
- 两边提交历史不一致，Git 不知道该怎么合并

------

## 💡 你现在该怎么做？

1. **推荐做法：合并式 pull → push**

```bash
git config pull.rebase false
git pull
git push origin master
```

1. **如果喜欢更干净的历史（高级玩家）：rebase 后再 push**

```bash
git config pull.rebase true
git pull
git push origin master
```

------

## ✅ 最后推荐（全局设置一劳永逸）

```bash
git config --global pull.rebase false   # 默认用 merge 模式
```





太棒啦 Neo！既然你都提出了这个需求，那我就直接给你整一份干净利落的 🎯**Git 高级命令实战训练营清单**，包含：

- 场景设定 ✅
- 命令目标 ✅
- 练手任务 ✅
- 附带注意事项 ✅

------

# 🚀 场景实战

------

## 1️⃣ 场景：**合并冲突后撤销操作**

💥 你执行了 `git merge feature`，结果一堆文件冲突，还没开始改就后悔了……

### 🎯 目标：

- 撤销 merge 操作
- 回到合并之前的状态

### 🛠 操作：

```bash
git merge feature         # 模拟合并产生冲突
git merge --abort         # 🧨 立刻撤销合并，回到之前状态
```

### 📌 注意事项：

- 只适用于**还没解决冲突前**的撤销
- 如果你已经解决了一部分冲突，要用：

```bash
git reset --hard HEAD
```

------

## 2️⃣ 场景：**找回误删分支或回滚版本**

😭 手滑 `git branch -D bugfix-xxx`，现在想要找回

### 🎯 目标：

- 找回你删掉的分支或误操作的提交

### 🛠 操作：

```bash
git reflog                # 找到分支最后的 commit 哈希
git checkout -b bugfix-xxx <commit-id>
```

示例：

```plain
git checkout -b bugfix-xxx d4f2a7c
```

### 📌 小贴士：

- `git reflog` 是 Git 的黑匣子，啥都能找回来（只要还没 gc）

------

## 3️⃣ 场景：**多人协作开发时同步主分支并 rebase 提交**

🧑‍🤝‍🧑 你在 `feature-xxx` 上开发，结果 `main` 分支更新了，想保持历史干净就不能直接 merge

### 🎯 目标：

- 把主分支的最新提交合并进你的功能分支
- 使用 `rebase` 而不是 `merge`

### 🛠 操作：

```bash
git checkout feature-xxx
git fetch origin
git rebase origin/main
```

如果有冲突：

```bash
# 解决冲突后：
git add .
git rebase --continue
```

### 📌 注意事项：

- 不要在公共分支 rebase（会让别人 history 混乱）
- rebase 是让提交更“像一条直线”，但操作前建议备份一份分支

------

## 4️⃣ 场景：**Cherry-pick 热修复 commit 到多个分支**

🚨 线上生产出了问题，你在 `hotfix/fix-404` 分支修好了，现在要把这个 bugfix 提交同步到 `main` 和 `release/1.0`

### 🎯 目标：

- 精确复制某个提交到其他分支

### 🛠 操作：

```bash
git log --oneline             # 找到那个 fix 的 commit id
git checkout main
git cherry-pick <commit-id>
git checkout release/1.0
git cherry-pick <commit-id>
```

------

## 5️⃣ 场景：**多个小 commit 打成一个，准备发 PR**

✅ 你在开发中提交了 5 个小碎提交，现在准备发 PR，想压缩成一个漂亮的 commit

### 🎯 目标：

- squash 压缩多个 commit
- 美化提交历史

### 🛠 操作：

```bash
git log --oneline            # 看你要压缩几个
git rebase -i HEAD~5         # 交互式 rebase 最近5个提交
```

然后在编辑界面：

```plain
pick  123abc  初始提交
squash 456def  修复 typo
squash 789aaa  增加校验
squash abc999  重构函数
squash xyz333  修改注释
```

保存后输入新的 commit message，比如：

```plain
feat: 完善登录功能 & 代码优化
```

然后：

```bash
git push -f origin feature/login
```

注意：你改了历史，需要用 `-f` 强推 ⚠️

------

## ✅ 速查表：

| 场景                   | 关键命令                         |
| ---------------------- | -------------------------------- |
| 撤销冲突合并           | `git merge --abort`              |
| 找回误删分支           | `git reflog` + `git checkout -b` |
| 同步主分支 + Rebase    | `git rebase origin/main`         |
| 精确复制修复 commit    | `git cherry-pick <id>`           |
| 多个提交压缩成一个提交 | `git rebase -i HEAD~N`           |