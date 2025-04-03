---
title: win10系统换成Ubuntu系统
date: 2025-03-28 00:24:58
categories:
    - 技术
    - 运维
    - Ubuntu
tags: Ubuntu
---
## 背景
我有一台安装了win10的电脑主机闲置，想将其换成Ubuntu系统，作为服务器使用
## mac下制作Ubuntu系统USB启动盘
准备一个U盘
下载Ubuntu镜像，官网下载很慢可以上阿里云华为等国内镜像网站下载
macos安装balenaEtcher Mac版
![](https://cdn.jsdelivr.net/gh/neoisok/assets@main/images%2F2025%2F03%2F28%2F20250328215415372-780d5dbfe84e070fb561afe86c796b35.png)
选择镜像->选择U盘->开始烧录
![](https://cdn.jsdelivr.net/gh/neoisok/assets@main/images%2F2025%2F03%2F28%2F20250328220141061-94e5ed6cbbbfa9bba49fa2aadfdcd704.png)
<img src="https://cdn.jsdelivr.net/gh/neoisok/assets@main/images%2F2025%2F03%2F28%2F20250328220141061-94e5ed6cbbbfa9bba49fa2aadfdcd704.png" width=600px>

## 安装Ubuntu系统
插入U盘重启win10系统，intel nuc 按F10 选择U盘为启动盘
选择安装Ubuntu系统
选择最小化安装 minimized
## 配置ssh和代理
固定ip并且