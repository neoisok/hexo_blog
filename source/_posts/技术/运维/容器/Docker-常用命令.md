---
title: Docker 常用命令
date: 2025-03-19 12:54:08
tags: 
    - docker
categories: 
    - 技术
    - 运维
    - 容器
--- 

## windows下利用docker 搭建ubuntu 环境
### **1、首先安装docker**
```shell
docker system df # 查看镜像、容器、数据卷占用空间
docker images # 查看docker镜像 
docker image ls # 查看镜像
docker ps # 查看所有启动的容器
docker ps -a # 查看所有容器
docker rm -f id/name # 删除容器
docker image rm ID # 删除镜像
docker image prune # 删除虚悬镜像(dangling image)，由于新旧镜像同名，旧镜像名被取消，导致仓库名和标签均为<none>

docker commit 26ea8c57c7bf ubuntupython3 # 从容器创建一个新的镜像，可以自己搭建一个ubuntu+python的开发环境，作为一个镜像，这样再次新建容器时可以以此为基础

```
### **2、获取镜像**
```shell
docker search ubuntu # 查找ubuntu镜像
docker pull ubuntu # 默认安装latest版本
docker pull ubuntu:16.04 # 指定版本
```
### **3、以镜像为基础启动并运行一个容器 ：https://docs.docker.com/engine/reference/commandline/container_start/**
```shell
docker run -it --rm ubuntu:16.04 bash # -i 交互式操作 -t 终端 --rm 容器退出后将其删除
docker run -itd ubuntu bash # 后台运行
docker run --name=openvino -it ubuntu:18.04 # 指定名字
docker run -it -v E:/data:/home/data ubuntu bash # 挂在宿主机文件目录，实现文件共享
exit # 退出容器
docker container start -i container_name # 重新启动
docker container stop # 终止容器
docker exec -it id/name bash # 进入容器

# docker attach 必须attach 到一个已经运行的容器, 使用exit会导致容器停止
# 进入退出的容器
docker start openvino
docker attach openvino
# 移除容器及其挂载卷，不会对镜像造成影响
docker rm -v container_id

# 批量删除停止的容器
docker rm -v $(docker ps -a -q -f status=exited)


# 修改容器的挂载目录:提交现有容器为新镜像，然后重新运行它
docker commit 5a3422adeead newimagename
docker run -ti -v "$PWD/dir1":/dir1 -v "$PWD/dir2":/dir2 newimagename /bin/bash
```

```shell
## Docker文件系统和数据卷:https://zhuanlan.zhihu.com/p/73288338
# Docker中的数据可以存储在类似于虚拟机磁盘的介质中，称为数据卷（Data Volume）
# 通常存储在容器中的一般文件随着容器的删除而消失，而数据卷独立于容器存在，并不会随着容器的删除而删除
# 数据卷除了延长数据的生命周期，还可以用于容器间的数据共享
# 创建数据卷
docker volume create volume_name
docker run -it -v /data3 --name=volume2 image_id/image_name # 启动容器并创建一个数据卷
docker run -it -v volume_name:/data4 --name=volume3 image_id/image_name # 指定数据卷挂载容器目录
docker run -it -volumes_from 容器ID --name=volume4 image_id # 挂载其他容器的数据卷
# 查看所有数据卷
docker volume ls
# 删除数据卷
docker volume rm 数据卷名
# 删除所有无主的数据卷
docker volume prune

# 挂载宿主机目录
docker run -it --name=test -v /宿主机目录:/容器目录 image_id
# 将数据卷的数据同步到宿主机：可以创建一个新容器挂载数据卷容器，同时挂载一个本地目录，通过cp命名将数据拷贝到本地目录
docker run –rm –volumes-from=volume2 –name=“volume8” -v /data/www/fjh3:/fjh3:rw 镜像ID cp –rf /data1 /fjh3

ps # 显示进程信息
top # 实时显示进程动态，输入q或者按ctrl c 退出

```
### **4、ubuntu部分**
```shell
cat /etc/os-release # 查看ubuntu版本
# https://man.linuxde.net/apt-get apt-get命令
apt-get update # 更新apt-get
apt-get remove packagename # 保留配置文件
apt-get purge packagename # 删除配置文件
apt-get autoclean apt # 删除已删掉软件的备份
apt-get clean # 删除安装软件的备份
apt-get upgrade # 更新已安装的软件包
# 安装常用工具
apt-get install -y vim
apt-get install -y python3
apt-get install -y python3-pip
apt-get install -y git # 安装git　 git --version 查看版本
apt-get install wget # wget 用于从指定的url下载文件
apt-get install -y dos2unix
```
### **5、搭建开发环境**
```shell
# Python环境：https://blog.csdn.net/m0_38124502/article/details/78090902
pip freeze >requirements.txt # 将当前项目的python环境导出
pip install -r requirements.txt # 安装

## 源码安装主要有三个步骤：配置(configure)、编译(make)、安装(make install)
./configure --help
./configure --prefix=/usr/local # 指定安装目录

pip3 install opencv-python

```