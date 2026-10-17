---
title: Win 上安装 WSL2 的方法
description: 一条命令装好 WSL2，含条件确认、装到非 C 盘、踩坑对照表，以及旧版 Windows 的兜底方案。
pubDate: 2026-10-11
category: tech
tags: [WSL2, Windows, 开发环境]
draft: false
---

WSL2 是 Windows 上做 Linux 开发的标准姿势。安装本身其实只要一条命令，麻烦的都集中在「装之前的条件确认」和「装之后的验证」上。下面按顺序来。

## 一、先确认满足条件

按 `Win + R` 输入 `winver` 看版本号：

- **Windows 11** → 直接可以装
- **Windows 10 版本 2004 及以上（内部版本 19041+）** → 可以装
- 更早的版本（如 1809、1909）→ 需要走文末的「手动安装」老路

同时确认 BIOS 里虚拟化（Intel VT-x / AMD-V）已开启。打开 **任务管理器 → 性能 → CPU**，右下角若有「虚拟化：已启用」就 OK；显示「已禁用」就要进 BIOS 打开。

## 二、正式安装（一条命令）

1. 开始菜单搜 **PowerShell**，右键 → **以管理员身份运行**
2. 输入这一条，回车：

```powershell
wsl --install
```

它会自动帮你做四件事：启用「适用于 Linux 的 Windows 子系统」、启用「虚拟机平台」、下载安装最新 WSL 内核、安装默认发行版 **Ubuntu**。

3. **重启电脑**（必须，别跳过）
4. 重启后 Ubuntu 会自动弹出一个黑窗口，等它解压完，然后按提示输入：
   - `Enter new UNIX username:` → 输入一个 Linux 用户名（小写字母，例如 `dev`）
   - `New password:` → 设密码（**输入时不显示星号，是正常的**），再输一遍确认

完成后你就进到 Linux 命令行里了，可以用 `lsb_release -a` 或 `uname -r` 验证。

## 三、确认装的是 WSL2

回到 PowerShell：

```powershell
wsl -l -v
```

`VERSION` 那一列显示 **2** 就对了。如果是 1，执行：

```powershell
wsl --set-version Ubuntu 2
wsl --set-default-version 2
```

建议再跑一次 `wsl --update` 把内核升到最新，然后从微软商店装 **Windows Terminal**，用它开 WSL 体验好很多。

## 四、换发行版与常用命令

```powershell
wsl --list --online                  # 查看有哪些可安装
wsl --install -d Debian              # 指定发行版
wsl --install -d Ubuntu-22.04        # 也可以指定版本
wsl --unregister Ubuntu              # 卸载某个发行版（数据会一起删）
wsl --shutdown                       # 关闭所有 WSL 实例
```

支持的常见发行版：Ubuntu、Debian、Kali Linux、openSUSE、AlmaLinux、Oracle Linux、Fedora Remix。

### 装到非 C 盘（可选）

WSL 默认把发行版放在系统盘，容器、模型一多很快就把 C 盘占满。最省事的做法是**在安装时就指定位置**：

```powershell
wsl --install -d Ubuntu-24.04 --location "E:\WSL\Ubuntu-24.04"
```

已经装到 C 盘的，用「导出再导入」的方式迁移：

```powershell
wsl --shutdown
wsl --export Ubuntu E:\ubuntu.tar
wsl --unregister Ubuntu
wsl --import Ubuntu E:\WSL\Ubuntu E:\ubuntu.tar --version 2
```

> WSL 2.5+ 还支持更省事的一条命令直接搬：`wsl --manage Ubuntu --move "E:\WSL\Ubuntu"`。

## 五、发行版下载卡住：用镜像导入（国内常用兜底）

`wsl --install` 本体很快，但下载发行版走的是微软 CDN。国内常见的结果是下载条卡在 `0.0%`，或者直接报：

```text
WslRegisterDistribution failed with error: 0x80072efd
WININET_E_CANNOT_CONNECT
```

这时候不用重装 WSL —— WSL 本体其实已经装好了，只是发行版没拉下来。从国内镜像下一个 `.wsl` 镜像文件，手动导入即可：

```powershell
# 1) 从阿里云镜像下载（清华、中科大、华为云也有）
#    https://mirrors.aliyun.com/ubuntu-releases/24.04/ubuntu-24.04.5-wsl-amd64.wsl

# 2) 导入到指定目录（每个发行版必须独立目录）
wsl --import Ubuntu-24.04 E:\wsl\Ubuntu-24.04 .\ubuntu-24.04.5-wsl-amd64.wsl --version 2
```

下载时如果单线程只有几十 KB/s，那是镜像站对单连接限速，分段多线程（`curl -r` 起 8 个连接）能快 5~10 倍。

### 导入之后的第一件事：建用户

`wsl --import` 没有商店版那套「创建用户」引导，**首次启动直接是 root**。手动补一下：

```bash
adduser fanta
usermod -aG sudo fanta
printf '[user]\ndefault=fanta\n' > /etc/wsl.conf
```

然后在 Windows 侧执行 `wsl --shutdown`，再进就是普通用户了。

> 另外提醒：所有发行版的虚拟磁盘都叫 `ext4.vhdx`，**导入到同一个目录会互相覆盖**。一个发行版一个目录。

## 六、踩坑对照表

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 跑 `wsl --install` 却打印出一堆帮助文本 | 系统已装过 WSL，命令被当成普通调用 | 用 `wsl --install -d Ubuntu` |
| 卡在 `0.0%` 不动 | 走微软 CDN 下载被卡住 | 改用 `wsl --install --web-download -d Ubuntu` |
| 报「无法解析服务器的名称或地址」 | DNS / 网络代理问题 | 挂代理重试，或把 DNS 改为 `8.8.8.8` / `114.114.114.114` |
| 报 `0x80370102` / 提示需要虚拟化 | BIOS 虚拟化没开 | 进 BIOS 开启 VT-x / AMD-V |
| 提示需要启用虚拟机平台 | 组件没启用 | 管理员 PowerShell 执行 `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart` 后重启 |
| 提示 WSL2 需要更新内核 | 缺内核更新包 | `wsl --update`，或手动安装 [wsl_update_x64.msi](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi) |
| 装到 C 盘快满了 | 默认存放在系统盘 | 用 `wsl --export` 再 `wsl --import` 迁移到其他盘 |
| 报 `WININET_E_CANNOT_CONNECT` | 微软 CDN 下载不通 | 见上一节，用国内镜像 `.wsl` 导入 |

## 七、Windows 太旧（内部版本 < 19041）的手动安装

1. 管理员 PowerShell 执行：`dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`
2. 再执行：`dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`
3. **重启**
4. 安装 WSL2 内核更新包 [wsl_update_x64.msi](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)
5. `wsl --set-default-version 2`
6. 到微软商店搜索 Ubuntu 安装

## 小结

Win11 或 Win10 2004+ 只要 `wsl --install` 一条命令，重启后设好用户名密码即可；装完用 `wsl -l -v` 确认版本是 2。真正会绊住人的无非是**虚拟化没开、下载卡住、C 盘占满**这三类问题，对照上面的表基本都能解决。
