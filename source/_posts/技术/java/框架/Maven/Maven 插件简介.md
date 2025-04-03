---
title: Maven 插件简介
date: 2025-03-28 00:24:58
categories:
    - 技术
    - java
    - 框架
    - Maven
tags: Maven
---
# 插件执行时机
> 插件是怎么被“触发执行”的？需要什么条件？执行时机是什么？
## 🔑 一、插件的两种执行方式

### ✅ 方式一：**命令行直接调用插件目标（goal）**

你手动执行插件：

```bash
mvn [plugin-name]:[goal-name]
mvn exec:java -Dexec.mainClass=com.example.Main
mvn antrun:run
mvn myplugin:mygoal
```

> 这种方式叫做：**直接调用目标（Direct goal invocation）**

插件在命令执行时立即触发，仅执行该插件目标，不涉及生命周期。

---

### ✅ 方式二：**插件绑定到生命周期阶段自动执行**

你执行生命周期命令：

```bash
mvn compile
mvn package
mvn install
```

> Maven 会自动执行 **绑定到这些阶段的插件目标**

#### 举个例子：

```bash
mvn package
```

Maven 会自动执行这些阶段（生命周期）：

```
validate → compile → test → package
```

而每个阶段都有绑定的插件目标，例如：

| 阶段       | 执行插件                      | 执行目标      |
|------------|-------------------------------|----------------|
| `compile`  | `maven-compiler-plugin`       | `compile`      |
| `test`     | `maven-surefire-plugin`       | `test`         |
| `package`  | `maven-jar-plugin`（或 war）   | `jar` / `war`  |

这些插件是在**执行阶段时自动被触发的**。

---

## 🧱 二、插件执行条件一览表

| 插件配置方式 | 插件何时执行？ | 举例 |
|--------------|----------------|------|
| 未绑定生命周期、命令行直接调用 | 只有你手动执行时才会运行 | `mvn exec:java` |
| 默认绑定（生命周期绑定了默认插件） | 执行生命周期阶段命令时自动执行 | `mvn compile` 会调用 `maven-compiler-plugin` |
| 自定义绑定（通过 `<executions>` 配置） | 绑定的阶段触发时执行该插件 | `mvn package` 会触发你绑定到 package 的插件 |
| 没有绑定也没有调用 | 永远不会执行 | 插件写了但没人用 |

---


1. 配置一个 `antrun` 插件，不绑定生命周期
2. 执行 `mvn compile` → 不会执行插件
3. 改成绑定到 `compile` 阶段
4. 再执行 `mvn compile` → 插件被自动执行！

---
# 插件分类

## 🧩 一、从功能维度分：Maven 插件的两大类

| 分类                              | 配置位置           | 何时执行                                | 说明               |
| --------------------------------- | ------------------ | --------------------------------------- | ------------------ |
| **构建插件（Build Plugins）**     | `<build><plugins>` | 构建时执行（compile、test、package 等） | 参与生命周期流程   |
| **报告插件（Reporting Plugins）** | `<reporting>`      | 执行 `mvn site` 时执行                  | 生成项目文档和报告 |

------

### ✅ 构建插件（Build Plugin）

- 执行时机：构建生命周期中，如 `mvn compile`、`mvn test`、`mvn package`
- 配置位置：`<build><plugins>`
- 可通过 `<executions>` 绑定生命周期阶段
- 可以通过命令行手动调用目标（如 `mvn exec:java`）

📌 示例插件：

| 插件                                    | 功能                   |
| --------------------------------------- | ---------------------- |
| `maven-compiler-plugin`                 | 编译 Java 代码         |
| `maven-surefire-plugin`                 | 运行单元测试           |
| `maven-jar-plugin` / `maven-war-plugin` | 打包成 jar/war         |
| `exec-maven-plugin`                     | 运行 Java 程序         |
| `maven-deploy-plugin`                   | 发布构建产物到远程仓库 |

------

### ✅ 报告插件（Reporting Plugin）

- 执行时机：`mvn site` 执行时
- 配置位置：`<reporting>` 标签下
- 主要用于生成站点报告（依赖树、测试覆盖率、项目信息等）

📌 示例插件：

| 插件                                | 功能                                         |
| ----------------------------------- | -------------------------------------------- |
| `maven-project-info-reports-plugin` | 生成项目信息报告（依赖树、开发者、许可证等） |
| `maven-surefire-report-plugin`      | 测试报告                                     |
| `maven-javadoc-plugin`              | JavaDoc API 文档                             |
| `maven-pmd-plugin`                  | 代码质量检查报告                             |

> 注意：如果你用命令行执行报告插件的某个目标（如 `mvn javadoc:javadoc`），它不会使用 `<reporting>` 中的配置，而是使用 `<build>` 中的。

------

## 🧠 二、从触发方式维度分：Maven 插件的执行分类

| 类别                 | 特点                       | 触发方式                    | 示例                                             |
| -------------------- | -------------------------- | --------------------------- | ------------------------------------------------ |
| **生命周期绑定插件** | 被绑定到某个阶段自动执行   | `mvn compile` `mvn package` | `maven-compiler-plugin`, `maven-surefire-plugin` |
| **手动调用插件**     | 只能通过命令行手动调用目标 | `mvn dependency:tree`       | `maven-dependency-plugin`, `exec-maven-plugin`   |
| **报告生成插件**     | 用于生成 HTML 报告         | `mvn site`                  | `maven-project-info-reports-plugin`              |

------

## 🔍 三、特殊分类（按功能细分）

### 🔨 编译与打包类

- `maven-compiler-plugin`
- `maven-jar-plugin`
- `maven-war-plugin`
- `maven-assembly-plugin`
- `maven-shade-plugin`

### 🧪 测试类

- `maven-surefire-plugin`（单元测试）
- `maven-failsafe-plugin`（集成测试）

### 📦 发布与依赖管理类

- `maven-install-plugin`
- `maven-deploy-plugin`
- `maven-dependency-plugin`

### 📊 报告与文档类

- `maven-javadoc-plugin`
- `maven-site-plugin`
- `maven-pmd-plugin`
- `maven-checkstyle-plugin`

### 🛠️ 运行执行类

- `exec-maven-plugin`
- `antrun-maven-plugin`

------

## ✅ 总结一句话：

> Maven 插件从大的方向分为：
>
> - **构建插件**（参与 lifecycle）
> - **报告插件**（参与 site 报告）
>
> 然后又可以按功能细分为：编译、测试、打包、文档、发布、执行类等。

------
# 插件CLI执行
```
mvn [plugin-prefix]:[goal]
mvn javadoc:javadoc 
```
它的结构是：

| 部分           | 含义                  |
|----------------|-----------------------|
| `javadoc`（前半） | 插件前缀（plugin prefix） |
| `javadoc`（后半） | 插件目标（goal）         |

javadoc 这个前缀，是 Maven 根据 插件的 artifactId 映射的默认前缀
实际使用的插件是：
```xml
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-javadoc-plugin</artifactId>
```

你没有写 `maven-javadoc-plugin:javadoc`，但 Maven 会自动通过前缀 `javadoc` 去找这个插件。
## 🔍 Maven 是怎么知道 `javadoc` 前缀对应哪个插件的？

它查的是插件 `META-INF/maven/plugin.xml` 中的 `<goalPrefix>` 字段。

比如 `maven-javadoc-plugin` 插件里就定义了：

```xml
<goalPrefix>javadoc</goalPrefix>
```

所以你才能用 `mvn javadoc:javadoc` 简写命令。

---

## ✅ 怎么确认某个前缀对应哪个插件？

使用命令：

```bash
mvn help:describe -Dplugin=javadoc
```

输出中你会看到：

```text
Name: Maven Javadoc Plugin
Prefix: javadoc
Group Id: org.apache.maven.plugins
Artifact Id: maven-javadoc-plugin
Version: ...
```

---
# 查询插件详细信息
当需要查询某个插件的信息时候执行，执行完会输出一堆信息代表什么意思呢
mvn help:describe -Dplugin=javadoc
```
(base) ➜  ~ mvn help:describe -Dplugin=javadoc

[INFO] Scanning for projects...
[INFO]
[INFO] ------------------< org.apache.maven:standalone-pom >-------------------
[INFO] Building Maven Stub Project (No POM) 1
[INFO] --------------------------------[ pom ]---------------------------------
[INFO]
[INFO] --- help:3.5.1:describe (default-cli) @ standalone-pom ---
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-javadoc-plugin/maven-metadata.xml
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-javadoc-plugin/maven-metadata.xml (1.6 kB at 4.7 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-javadoc-plugin/3.11.2/maven-javadoc-plugin-3.11.2.pom
.....

Name: Apache Maven Javadoc Plugin
Description: The Apache Maven Javadoc Plugin is a plugin that uses the
  javadoc tool for generating javadocs for the specified project.
Group Id: org.apache.maven.plugins
Artifact Id: maven-javadoc-plugin
Version: 3.11.2
Goal Prefix: javadoc

This plugin has 17 goals:

javadoc:aggregate
  Description: Generates documentation for the Java code in an aggregator
    project using the standard Javadoc Tool . Since version 3.1.0 an aggregated
    report is created for every module of a Maven multimodule project.
  Note: This goal should be used as a Maven report.
....

For more information, run 'mvn help:describe [...] -Ddetail'

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  7.184 s
[INFO] Finished at: 2025-03-28T10:25:41+08:00
[INFO] ------------------------------------------------------------------------
```

---

## 🔍 一、`Scanning for projects...` 是在干嘛？

```text
[INFO] Scanning for projects...
```

这是 Maven 的标准启动流程中的第一步，它会：

### ✅ 尝试在**当前目录下**查找是否存在一个 Maven 项目

- 它会扫描当前目录及其父目录，看有没有 `pom.xml`
- 如果没有，就会创建一个 **默认的占位项目（Stub Project）**，这个项目是虚拟的，不写磁盘，不留痕迹，不用删除。输出你看到的：

```text
[INFO] Building Maven Stub Project (No POM) 1
```

📌 你当前目录下**没有 `pom.xml`**，所以 Maven就自动构造了一个“空项目”来执行你的 `help` 命令。

---

## 📦 二、为什么要从中央仓库下载插件？

你执行的命令是：
```bash
mvn help:describe -Dplugin=javadoc
```

这条命令的含义是：

> 👉 请告诉我 **前缀为 `javadoc`** 的插件信息（如它绑定的目标、支持的参数等）

### 🔽 于是 Maven 要做什么？

1. 先查你本地仓库（`~/.m2/repository`）有没有 `maven-javadoc-plugin`
2. 没有找到或版本不完整，就会去 **中央仓库** 下载
3. 下载的是：

| 下载内容 | 作用 |
|----------|------|
| `maven-metadata.xml` | 获取该插件的可用版本列表 |
| `maven-javadoc-plugin-3.11.2.pom` | 获取插件描述文件，包括 `<goalPrefix>` |
| `plugin.xml`（在 jar 包内） | 提供目标、参数等详细信息，Maven 会读取它生成 describe 输出

---

## 📂 三、下载的这些文件保存到哪里？

下载到你本地的 Maven 仓库路径：

```text
~/.m2/repository/org/apache/maven/plugins/maven-javadoc-plugin/3.11.2/
```

你可以直接去这个路径下看到：

```
maven-javadoc-plugin-3.11.2.jar
maven-javadoc-plugin-3.11.2.pom
```

---

## ✅ 四、补充说明：即使你只是查个帮助，它也需要插件本体

这是因为：

- `help:describe` 命令要解析插件的 `plugin.xml`（包含所有参数说明）
- 这个文件在插件 jar 包中
- 所以必须下载插件本体

---

## ✅ 总结一句话

> Maven 每次执行命令前，都会扫描当前目录查找项目（`pom.xml`）  
> 如果没有，就创建临时项目继续执行  
> 如果你请求插件信息，而本地没有插件，就会从中央仓库下载  
> 下载内容默认存储在本地仓库：`~/.m2/repository`，下次不会重复下载

---

## 🎯 问题：为什么执行 `mvn help:describe` 没有构建项目，最后还显示：

```text
[INFO] BUILD SUCCESS
```

是不是很像你做了一件“没啥好构建”的事，结果却说“构建成功”？那这个“BUILD”到底构建了啥？

---

## ✅ 实际上，这个 **BUILD SUCCESS 是 Maven 的通用提示语**

无论你执行的命令是不是构建类命令（如 `compile`、`package`），Maven 在整个流程顺利完成时，都会统一输出：

```text
[INFO] BUILD SUCCESS
```

它的含义其实更接近于：

> 🟢 “这条 Maven 命令执行成功，没有错误发生。”

并不代表你“真的构建了一个项目”或“打了个包”。

---

## 🧠 举个例子帮助你理解：

| 执行命令 | 实际干的事 | 是否输出 BUILD SUCCESS |
|----------|------------|-------------------------|
| `mvn compile` | 编译项目代码 | ✅ |
| `mvn package` | 打包成 jar/war | ✅ |
| `mvn help:describe -Dplugin=compiler` | 查询插件信息 | ✅ |
| `mvn dependency:tree` | 打印依赖树 | ✅ |
| `mvn clean` | 删除 `target` 目录 | ✅ |

只要命令执行**没有报错、退出码为 0**，就会显示 `BUILD SUCCESS`。

---

## 🛠️ 那如果出错会看到什么？

比如拼错插件名：

```bash
mvn foo:bar
```

你会看到：
```text
[ERROR] No plugin found for prefix 'foo'...
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
```

---

> `BUILD SUCCESS` ≠ 真正构建了项目，而是表示：**Maven 本次命令流程执行成功，没出错。**

---

# 🧰 `mvn help:describe` 常用命令速查

---

## ✅ 1. 查看某个插件的基本信息（不指定目标）

```bash
mvn help:describe -Dplugin=compiler
```

输出内容：

- 插件名称、前缀（prefix）
- groupId / artifactId / version
- 支持的目标（goals）

---

## ✅ 2. 查看插件某个目标（goal）的详细参数（常用）

```bash
mvn help:describe -Dplugin=compiler -Dgoal=compile -Ddetail
```

输出内容：

- `compile` 目标的参数列表
- 参数名、类型、是否必填、默认值、配置方式（CLI or POM）
- 有效的表达式（如 `${project.build.sourceDirectory}`）

---

## ✅ 3. 查看插件使用的版本（你当前项目中实际使用的）

```bash
mvn help:describe -Dplugin=compiler -Ddetail
```

Maven 会自动解析插件来自哪里，显示当前版本。

🧠 如果你没有手动指定 `<version>`，它也会显示默认使用的版本（来自超级 POM 或 pluginManagement）

---

## ✅ 4. 查某个插件命令的完整结构

```bash
mvn help:describe -Dplugin=exec -Dgoal=java -Ddetail
```

可以看到 `exec:java` 的所有支持参数，比如 `mainClass`、`arguments` 等，非常适合调试 CLI 运行问题。

---

## ✅ 5. 查命令背后的插件是谁（前缀映射）

```bash
mvn help:describe -Dplugin=javadoc
```

输出内容包含：

- plugin prefix：javadoc
- groupId/artifactId：`org.apache.maven.plugins:maven-javadoc-plugin`
- 所有目标（goals）

📌 适合解释 “mvn javadoc:javadoc” 背后到底是谁在干活。

---
## 只知道 artifactId 时的处理技巧

你知道它叫 `maven-compiler-plugin`，Maven 默认插件都在同一个 group 下，可以写：

```bash
mvn help:describe -Dplugin=org.apache.maven.plugins:maven-compiler-plugin
```

🔍 输出会告诉你：
```text
Name: Maven Compiler Plugin
Prefix: compiler
Group Id: org.apache.maven.plugins
Artifact Id: maven-compiler-plugin
```

现在你就知道它的前缀是 `compiler` 了，可以写：
```bash
mvn help:describe -Dplugin=compiler -Dgoal=compile -Ddetail
```

---
## 📋 进阶技巧提示

### ✅ 想查询多个插件？循环执行：
```bash
for plugin in compiler surefire jar site; do
  mvn help:describe -Dplugin=$plugin -Ddetail
done
```

### ✅ 搭配 `mvn help:effective-pom` 使用
先查看实际插件版本，再查该插件的参数定义。

---

## 🧠 总结一句话：

> `mvn help:describe` 是调试 Maven 插件的利器，能帮你：
> - 查插件来源
> - 看支持哪些目标（goals）
> - 每个目标支持哪些参数（含默认值、表达式）
> - 判断插件版本是否匹配

---

# mvn 命令参数的含义

## 🧩 一、`-D` 参数到底是什么？

```bash
mvn compile -Dkey=value
```

这个 `-D` 是 JVM 的标准参数格式，在 Maven 中：

> ✅ 用于向 Maven 或插件传递**系统属性（System Property）**

常见用途：
- 给插件传递参数（如 `-Dexec.mainClass=...`）
- 控制 profile 激活（如 `-Denv=prod`）
- 覆盖 POM 中的 `${property}` 变量

📌 例子：
```bash
mvn exec:java -Dexec.mainClass=com.example.Main
mvn help:describe -Dplugin=compiler
```

---

## 🔍 二、除了 `-D`，Maven 命令还支持哪些参数？

### ✅ 常用参数分类速查表：

| 参数 | 含义 | 示例 |
|------|------|------|
| `-D` | 设置系统属性 | `-DskipTests=true` |
| `-P` | 激活 Profile | `-Pdev` |
| `-pl` | 指定模块构建（multi-module 项目） | `-pl service-a` |
| `-am` | 同时构建依赖模块 | `-pl web -am` |
| `-f` | 指定 POM 文件路径 | `-f ../some-other-pom.xml` |
| `-U` | 强制更新远程仓库 SNAPSHOT | `-U` |
| `-X` | 打印调试日志 | `-X` |
| `-e` | 显示完整异常栈 | `-e` |
| `-B` | 批处理模式（适合脚本中使用） | `-B` |
| `-q` | 静默模式（Quiet） | `-q` |
| `-s` | 指定 `settings.xml` 文件 | `-s ~/.m2/mysettings.xml` |
| `-gs` | 指定全局 `settings.xml` 文件 | `-gs /path/to/settings.xml` |
| `-rf` | 从指定模块重新构建 | `-rf service-a` |
| `-T` | 并行构建线程数（如 `-T 4C`） | `-T 2`、`-T 1C` |
| `--fail-at-end` | 构建失败后继续剩下模块 | - |

---


## 🛠️ 四、实用组合示例：

| 目的 | 示例 |
|------|------|
| 跳过测试打包 | `mvn clean package -DskipTests=true` |
| 运行指定 profile 的打包流程 | `mvn package -Pprod` |
| 执行 main 方法 | `mvn exec:java -Dexec.mainClass=com.example.Main` |
| 查看插件信息 | `mvn help:describe -Dplugin=compiler -Dgoal=compile -Ddetail` |
| 多模块只构建一部分 | `mvn install -pl api -am` |
| 用测试 settings 构建 | `mvn deploy -s test-settings.xml` |

---

## ✅ 总结

> `-D` 是最常用的系统属性传参，但 Maven 命令支持 **丰富的参数组合**，你可以控制 profile、模块、线程数、输出模式等，非常适合灵活构建和调试。

# 常见问题
---

## 超级POM在哪个目录
超级 POM 并不直接以文件形式存储在你的磁盘中。
它是 Maven 内部的默认资源，打包在 Maven 的核心 Jar 包里。
## 在当前项目下执行mvn命令和在任何一个其他地方执行mvn命令有什么区别
✅ 在项目目录下执行 mvn 命令：
Maven 会读取当前目录的 pom.xml，按你的项目配置执行构建、依赖管理、插件绑定等。

✅ 在非项目目录下执行：
Maven 没找到 pom.xml，只能执行不依赖项目结构的命令（如 help:describe、dependency:get），否则会报错或生成一个临时的“Stub 项目”。

有 POM 就构建你的项目，没 POM 就只能玩工具命令。
## settings文件和超级POM和普通的POM什么关系
✅ settings.xml 是用户级 / 全局配置文件
✅ 超级 POM 是 Maven 提供的默认项目模板
✅ 项目 POM 是你当前项目自己的构建定义
👉 真正的 Maven 构建行为，是这三者共同作用、分工明确，而且有明确的优先级关系

---

### 🧠 三者核心作用对比表

| 维度 | `settings.xml` | **超级 POM** | **项目 POM (`pom.xml`)** |
|------|----------------|--------------|--------------------------|
| 角色 | 用户或环境级配置 | Maven 内置默认模板 | 项目自定义配置 |
| 控制范围 | 仓库、代理、镜像、profile 激活等 | 生命周期默认配置、插件绑定、中央仓库 | 项目的依赖、插件、模块、构建 |
| 配置位置 | `~/.m2/settings.xml` 或 Maven 安装目录 | Maven 的内部 JAR 包中 | 当前项目根目录 |
| 是否可见 | ✅ 可以编辑 | ❌ 不可直接编辑 | ✅ 你自己写的 |
| 是否必须 | ❌ 可选 | ✅ 始终存在 | ✅ Maven 项目的核心 |
| 典型用途 | 配置私服仓库、镜像源、激活 profile | 定义默认插件行为、目录结构 | 声明依赖、执行目标、构建产物等 |

---

### 🔄 三者的继承 / 覆盖关系（优先级）

Maven 的执行逻辑中，这三者有如下关系：

```text
              +--------------------+
              |  settings.xml      | ← 环境控制（镜像、私服、Profile 激活）
              +--------------------+
                        ↓
              +--------------------+
              |  超级 POM          | ← 默认行为（中央仓库、默认插件绑定）
              +--------------------+
                        ↓
              +--------------------+
              |  项目 POM (你写的) | ← 构建计划、依赖声明、插件配置
              +--------------------+
```

👉 项目 POM 可以覆盖超级 POM 的设置  
👉 settings.xml 可以控制环境行为，但**不能声明依赖**

---

### 🎯 举几个典型对比场景：

| 配置项 | 写在哪里 | 说明 |
|--------|-----------|------|
| 使用私服 Nexus | ✅ `settings.xml` → 配置 `<mirrors>` |
| 默认构建插件行为（如 jar） | 🧩 超级 POM 已绑定 | 项目 POM 可以覆盖插件版本 |
| 引入某个依赖（如 Spring Boot） | ✅ 项目 POM | 不能写在 `settings.xml` |
| 使用 JDK 版本 | ✅ 项目 POM `<properties>` | `settings.xml` 不负责构建参数 |

---



## 怎么看当前项目用了哪些插件？”

### ✅ 一句话速答：

> 使用 `mvn help:effective-pom` 命令，可以看到当前项目**生效的所有插件**（包括显式写的 + 继承的 + 默认的）。

---

### 🧩 方法一：用 `mvn help:effective-pom`

```bash
mvn help:effective-pom
```

它会输出合并后的完整 POM 内容，包括：

- 你自己写在 `<plugins>` 和 `<pluginManagement>` 中的插件
- 父 POM 中继承的插件
- 超级 POM 自动引入的插件（如 `maven-compiler-plugin`, `maven-jar-plugin`）

📌 搜索关键词：

```bash
<plugins>
```

可以快速定位所有插件配置。

---

### 🛠 方法二：从 `target` 目录的 `effective-pom.xml` 查看（如果生成了）

部分构建工具（如 IDEA）或 CI 流水线也可能会生成合并后的 POM：

```
target/effective-pom.xml
```

可以直接查看里面所有 plugin 配置。

---

### 🔍 方法三：查看构建日志时的插件调用（动态观察）

执行命令：

```bash
mvn package -X
```

或加 `-X` 查看完整日志，控制台中会显示：

```text
[INFO] --- maven-compiler-plugin:3.10.1:compile (default-compile) @ your-project ---
[INFO] --- maven-jar-plugin:3.2.2:jar (default-jar) @ your-project ---
```

这能看到**哪些插件在生命周期中被调用了、调用的是哪个目标**，非常适合观察实际构建流程。

---

### ✅ 实践：

1. 写一个最简单的 POM（不配置任何插件）
2. 执行：
   ```bash
   mvn help:effective-pom
   ```
3. 观察仍然有很多插件（默认从超级 POM继承）
4. 加上自定义插件，观察插件列表发生变化

---

### ✅ 总结

> 查看当前项目用了哪些插件，最权威的方式是用：  
> **`mvn help:effective-pom` → 查看 `<plugins>` 部分**
