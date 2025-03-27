---
title: Maven项目构建生命周期
date: 2025-03-28 00:24:58
categories:
    - 技术
    - java
    - 框架
    - Maven
tags: Maven
---

## Maven 项目构建生命周期（Build Lifecycle）

---

### 一、什么是生命周期（Lifecycle）？

> 生命周期是 Maven 的核心机制之一，定义了 **项目从清理到打包再到部署的全过程**，是由一系列有序的构建阶段（Phase）组成的。

简单理解就是：你运行一个 Maven 命令，比如 `mvn install`，Maven 会自动按照一个预定义的顺序，执行从编译、测试、打包到安装的所有阶段。

---

### 二、Maven 的三大内置生命周期

| 生命周期名称 | 作用说明 |
|--------------|---------|
| **default**（默认生命周期） | 项目的编译、测试、打包、部署等 |
| **clean** | 清理项目（删除之前构建的产物） |
| **site** | 生成项目文档、报告等 |

---

### 三、默认生命周期（default lifecycle）

Maven 的构建流程由多个“阶段”（Phase）组成，这些阶段是**有顺序的**，执行其中一个阶段会连带执行之前的所有阶段。

#### 主要构建阶段如下：

| 阶段名（Phase） | 功能说明 |
|------------------|----------|
| **validate**      | 验证项目是否正确，例如目录结构、必要信息是否完整 |
| **compile**       | 编译主源码（src/main/java） |
| **test**          | 编译并运行单元测试（src/test/java） |
| **package**       | 打包编译后的代码（如 jar/war） |
| **verify**        | 运行集成测试，验证包是否有效 |
| **install**       | 安装到本地 Maven 仓库，供本机其他项目使用 |
| **deploy**        | 发布到远程仓库，供团队共享使用（通常结合 CI/CD） |

> 📝 示例：`mvn install` 会依次执行：`validate → compile → test → package → verify → install`

---

### 四、clean 生命周期

用于清理之前构建的文件，主要阶段：

| 阶段 | 说明 |
|------|------|
| **pre-clean** | 清理前的准备工作（插件扩展用） |
| **clean**     | 删除 `target/` 目录（编译产物） |
| **post-clean**| 清理后的收尾操作 |

> 常用命令：`mvn clean` — 清理旧文件，避免构建污染。

---

### 五、site 生命周期（可选模块）

用于生成项目站点文档（文档网站、测试覆盖率、依赖报告等）：

| 阶段 | 说明 |
|------|------|
| **pre-site** | 准备生成站点 |
| **site**     | 生成文档网站 |
| **post-site**| 站点生成后的处理 |
| **site-deploy** | 部署站点到服务器 |

---

### 六、生命周期、阶段与插件三者关系

生命周期 ≠ 阶段 ≠ 插件  
Maven 实际上只是框架，**真正执行工作的都是插件**。

例如：
```bash
mvn clean
```
执行的是 `clean` 生命周期的 `clean` 阶段，具体操作由 `maven-clean-plugin` 实现。

下面是对**“六、生命周期、阶段与插件三者关系”**的**详细讲解**，包括概念区分、调用机制、示例分析、常见误区等

---

#### 1️⃣ 三者核心定义

| 概念 | 定义 | 举例 |
|------|------|------|
| **生命周期**（Lifecycle） | 一组预定义的构建阶段，用于组织项目构建过程 | `default`、`clean`、`site` |
| **阶段**（Phase） | 生命周期中的一个构建步骤，会被按顺序执行 | `compile`、`test`、`package`、`install` 等 |
| **插件**（Plugin） | 执行具体构建行为的工具，是 Maven 的扩展机制 | `maven-compiler-plugin`、`maven-surefire-plugin` 等 |

➡️ **阶段是生命周期的一部分，插件是实际干活的角色。**

---

#### 2️⃣ 三者调用关系：**你执行阶段，Maven调用插件**

比如执行命令：
```bash
mvn package
```

- 触发的是 `default` 生命周期中的 `package` 阶段
- Maven 会找该阶段默认绑定的插件和目标（goal）
- 执行 `maven-jar-plugin:jar` 来打包生成 `.jar` 文件

---

#### 3️⃣ 插件中的目标（Goal）

每个插件有一个或多个 **目标（goal）**，是插件中的具体任务单位。

例如：
```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <version>3.8.1</version>
  <executions>
    <execution>
      <phase>compile</phase>
      <goals>
        <goal>compile</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

表示：在 `compile` 阶段执行 `maven-compiler-plugin` 插件的 `compile` 目标。

---

#### 4️⃣ 阶段与插件绑定关系（默认）

| 阶段（Phase） | 默认绑定插件及目标（Goal） |
|---------------|-----------------------------|
| compile        | `maven-compiler-plugin:compile` |
| test           | `maven-surefire-plugin:test` |
| package        | `maven-jar-plugin:jar` / `maven-war-plugin:war` |
| install        | `maven-install-plugin:install` |
| deploy         | `maven-deploy-plugin:deploy` |

这些绑定都是**默认绑定**，也可以在 POM 中自定义绑定其他插件或替换默认插件。

---

#### 5️⃣ 可视化总结关系图：

```text
        [生命周期 Lifecycle]
                 ↓
         ┌──────────────┐
         │    阶段 Phase   │ → 按顺序执行（compile → test → package）
         └──────────────┘
                 ↓
        [插件 Plugin + 目标 Goal]  ← 真正执行具体操作
```

---

#### 6️⃣ 常见误区澄清

| 误区 | 正确认知 |
|------|----------|
| 以为 `mvn compile` 是插件命令 | ❌ 不是插件，而是执行“阶段” |
| 插件必须写在 POM 里才执行 | ❌ 有默认插件绑定，非必须 |
| 执行某阶段只执行该阶段 | ❌ 会连带执行前面所有阶段 |

---

#### 7️⃣ 实践建议：查看阶段与插件绑定关系

你可以通过以下命令查看完整的生命周期绑定：

```bash
mvn help:describe -Dcmd=compile
```

或查看某个插件目标的详细信息：

```bash
mvn help:describe -Dplugin=compiler -Dfull
```

---

### 七、常用构建命令速查表

| 命令 | 含义 |
|------|------|
| `mvn clean` | 清理项目 |
| `mvn compile` | 编译源代码 |
| `mvn test` | 执行单元测试 |
| `mvn package` | 打包 |
| `mvn install` | 安装到本地仓库 |
| `mvn deploy` | 发布到远程仓库 |

---