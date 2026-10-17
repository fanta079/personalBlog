---
title: 盯显存别只会 watch：nvidia-smi 的三种监控姿势
description: watch -n 1 nvidia-smi 能用，但刷屏还费终端。训模型时真正好用的是 dmon 和自带循环，附几条常备命令。
pubDate: 2026-10-15
category: tech
tags: [WSL2, GPU, 命令行]
draft: false
---

训练跑起来，第一件事就是想看看显存有没有顶到天花板。多数人的第一反应是：

```bash
watch -n 1 nvidia-smi
```

这能看，但有两个小问题：一是 `nvidia-smi` 那张表信息太杂，二是 `watch` 每秒清屏重绘，日志窗口会一直闪。

`nvidia-smi` 自己就能循环刷新，没必要套一层 `watch`。

## 一、自带循环：最少敲字

```bash
nvidia-smi -l 1        # 每秒刷新
nvidia-smi -l 2        # 每 2 秒
nvidia-smi -lms 500    # 每 500 毫秒
```

### 只要关键几列

全表看着累，用 `--query-gpu` 挑出来，一行显示：

```bash
nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu \
  --format=csv,noheader -l 1
```

输出就是这种一眼能读的形态：

```text
97 %, 7643 MiB, 8188 MiB, 74
```

想要带变化的对比效果，`watch` 的 `-d` 会高亮变化的字：

```bash
watch -n 1 -d 'nvidia-smi --query-gpu=utilization.gpu,memory.used,temperature.gpu --format=csv,noheader'
```

> `watch` 后面带空格或管道的命令**必须用单引号包住**，否则 shell 会先拆词再报错。

## 二、`dmon`：训练时最清爽

真正跑训练时我最常用的是这个：

```bash
nvidia-smi dmon -d 1
```

它只输出一行一个采样点的纯数字表，没有边框、没有进程列表，适合开着看几十分钟：

```text
# gpu   pwr gtemp mtemp    sm   mem   enc   dec  mclk  pclk
    0   118    74     -    98    91     0     0  7001  2535
```

想指定要看的列：

```bash
nvidia-smi dmon -s pucvmet -d 1
```

`p` 功耗、`u` 利用率、`c` 计算、`v` 显存、`m` 显存控制器、`e`/`t` 温度相关。参数写熟了就是一条命令搞定。

## 三、判断「健康」还是「要爆」

数字本身没意义，得知道看什么：

| 现象 | 含义 |
| --- | --- |
| 显存吃满 7~7.8GB、GPU 利用率 95~100% | 正常，8GB 卡就是这个样子 |
| 利用率在 20~40% 反复抖 | 数据加载或 batch 太小，卡在等 CPU |
| 显存缓慢持续上涨 | 多半是日志里累积了张量，检查有没有把 loss 存成 list |
| 显存一夜之间满格但速度掉十倍 | 检查 NVIDIA 控制面板的 Sysmem Fallback，可能已经在走 PCIe 了 |

最后一条是隐蔽杀手：显存爆了不报错，而是静默回落到内存，速度掉十倍还找不到原因。设成 `Prefer No Sysmem Fallback` 之后，它会老老实实 OOM 给你看。

## 小结

| 场景 | 命令 |
| --- | --- |
| 随手看一眼 | `nvidia-smi` |
| 持续监控、要清爽 | `nvidia-smi dmon -d 1` |
| 只要几列 | `--query-gpu=... --format=csv,noheader -l 1` |
| 想高亮变化 | `watch -n 1 -d '<上面那条>'` |

在 WSL 里这些命令一样可用，GPU 直通生效时 `nvidia-smi` 直接就能看到宿主卡。
