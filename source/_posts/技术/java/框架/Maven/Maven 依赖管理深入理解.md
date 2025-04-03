---
title: Maven 依赖管理深入理解
date: 2025-03-28 00:24:58
categories:
    - 技术
    - java
    - 框架
    - Maven
tags: Maven
---

---

# 📦 Maven 依赖管理深入理解

---

## 1️⃣ 本地仓库 / 中央仓库 / 私服仓库

### ✅ 本地仓库（Local Repository）

- 默认位置：`~/.m2/repository`
- 每次执行 Maven 命令，优先从本地仓库查找依赖
- 下载成功的依赖将缓存在此处（不会重复下载）

---

### ✅ 中央仓库（Maven Central）

- 默认远程仓库，地址：https://repo.maven.apache.org/maven2/
- 超级 POM 中内置，不写任何配置也能访问
- 缺失的依赖默认从这里下载到本地仓库

---

### ✅ 私服仓库（Nexus、Artifactory）

- 企业级常见：统一缓存、权限控制、私有发布
- 配置方式：写入 `~/.m2/settings.xml` 中的 `<mirrors>` 或 `<profiles>`：

```xml
<mirrors>
  <mirror>
    <id>nexus</id>
    <mirrorOf>central</mirrorOf>
    <url>https://nexus.company.com/repository/maven-public/</url>
  </mirror>
</mirrors>
```

---

## 2️⃣ 依赖传递与冲突解决

### ✅ 依赖传递（Transitive Dependency）

> Maven 会自动引入依赖的依赖（最多支持无限级）

🧱 示例：

```
项目A → 引入 spring-web
        → spring-web 自动引入 spring-core → spring-jcl
```

你不需要手动写每一级依赖。

---

### ✅ 冲突解决规则
---

#### 🔍 实际 Maven 的判定规则是：

##### ✅ 距离优先（Nearest First）
- 谁离根项目（项目 A）路径更短，谁胜

```
A
├── B（依赖 log4j:1.2.17）    ← 距离 = 2
│
└── C
     └── D
         └── log4j:2.17.0     ← 距离 = 4
```

在这个例子里：

- log4j:1.2.17 的路径是：A → B → log4j（共 2 层）
- log4j:2.17.0 的路径是：A → C → D → log4j（共 4 层）

✅ 所以最终使用：**log4j:1.2.17**（距离近）

##### ✅ 顺序优先（First Declaration Wins）
- 如果距离一样，谁**先出现在依赖树中**，谁胜出（通常是依赖声明顺序）

📌 举例：

```
项目A
├── B（log4j:1.2.17）
└── C（log4j:2.17.0）

→ A 最终使用 log4j:1.2.17（因为 B 先出现在依赖树中）
```

---

### 🔍 查看依赖冲突命令：

```bash
mvn dependency:tree
```

可以加 `-Dverbose` 显示冲突信息。

---

## 3️⃣ 依赖范围（scope）

控制依赖在构建生命周期中何时可用，是否打进包里：

| 范围 | 用途 | 编译可用 | 测试可用 | 运行可用 | 打进包 |
|------|------|----------|----------|----------|---------|
| `compile`（默认） | 常规依赖 | ✅ | ✅ | ✅ | ✅ |
| `provided` | 编译需要，运行由容器提供（如 Servlet） | ✅ | ✅ | ❌ | ❌ |
| `runtime` | 编译不需要，运行需要 | ❌ | ✅ | ✅ | ✅ |
| `test` | 仅测试代码用（如 JUnit） | ❌ | ✅ | ❌ | ❌ |
| `system`（不推荐） | 使用本地 jar 包 | ✅ | ✅ | ✅ | ✅ |
| `import` | 仅用于 `<dependencyManagement>` 引入 BOM | - | - | - | - |

📌 示例：

```xml
<dependency>
  <groupId>junit</groupId>
  <artifactId>junit</artifactId>
  <version>4.13.2</version>
  <scope>test</scope>
</dependency>
```

---

## 4️⃣ 排除依赖（exclusions）

用来解决**传递依赖冲突**或剔除无用/冲突组件。

📌 示例：排除 spring-boot-starter 中的 logback

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
  <exclusions>
    <exclusion>
      <groupId>ch.qos.logback</groupId>
      <artifactId>logback-classic</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

---

## 练习：

1. 手动引入冲突依赖，运行 `mvn dependency:tree` 观察谁胜出
2. 修改 `scope` 为 test，演示构建产物中是否包含
3. 用 exclusions 排除一个传递依赖，看效果
4. 演示切换中央仓库 → 私服仓库的 settings 配置行为

