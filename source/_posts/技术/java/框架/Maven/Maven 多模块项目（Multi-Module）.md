---
title: Maven 多模块项目（Multi-Module）
date: 2025-03-28 17:24:58
categories:
    - 技术
    - java
    - 框架
    - Maven
tags: Maven
---

# 🏗️ Maven 多模块项目（Multi-Module）

---

## 1️⃣ 父子项目结构设计

### ✅ 结构示意图：

```
multi-module-parent/
├── pom.xml             ← 父模块（聚合器 + 版本控制）
├── module-a/
│   └── pom.xml         ← 子模块A（如 API 层）
├── module-b/
│   └── pom.xml         ← 子模块B（如 Service 层）
```

### ✅ 父模块（Parent POM）特点：

- 类型为 `pom`
- 用来统一版本管理、依赖版本、插件版本
- 一般不包含实际代码

```xml
<packaging>pom</packaging>
```

---

### ✅ 子模块的 `pom.xml` 需要：

```xml
<parent>
  <groupId>com.neo</groupId>
  <artifactId>multi-module-parent</artifactId>
  <version>1.0.0</version>
</parent>
```

---

## 2️⃣ 聚合（Aggregation）vs 继承（Inheritance）

| 区别点 | 聚合 Aggregation | 继承 Inheritance |
|--------|------------------|------------------|
| 定义 | 在父模块中 `<modules>` 声明子模块 | 子模块在 `<parent>` 指向父模块 |
| 作用 | 用于一次性构建多个模块 | 用于复用 POM 中的版本、依赖、插件配置 |
| 是否必须写 | 父模块需要写 `<modules>` | 子模块需要写 `<parent>` |
| 构建影响 | `mvn install` 会构建所有模块 | 仅靠继承不会构建，需要聚合才能批量构建 |

### ✅ 示例（父模块）：

```xml
<modules>
  <module>module-a</module>
  <module>module-b</module>
</modules>
```

---

## 3️⃣ 多模块构建顺序控制

Maven 默认会**自动计算模块之间的依赖关系**，确保：

> **先构建被依赖的模块，再构建依赖它的模块**

---

### ✅ 举个例子：

```
A（依赖 B）
B（依赖 C）
C（最底层）
```

> Maven 构建顺序是：C → B → A

📌 使用命令：
```bash
mvn clean install
```
就会自动按依赖关系构建好所有模块。

---

### ❗ 注意：

如果你写了 `<modules>` 顺序是 A、B、C，Maven 仍然会自动识别依赖关系，按正确顺序构建！

---

## 🛠 实用命令小结：

| 命令 | 说明 |
|------|------|
| `mvn clean install` | 在父模块目录构建所有模块 |
| `mvn install -pl module-b` | 只构建指定模块（含依赖） |
| `mvn install -pl module-b -am` | 同时构建模块及其依赖模块 |
| `mvn install -pl module-a -am -amd` | 同时构建依赖模块和被依赖模块 |

---

## ✅ 口诀：

> 聚合管构建，继承管配置；  
> 顺序靠依赖，声明看结构；  
> 父子联动用，模块拆得巧。

---

