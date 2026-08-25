---
layout: home
hero:
  name: Kervein Wiki
  text: 把知识写成可复用的边界
  tagline: 从一个能重建的 C++ 项目开始，把每个决定、约束和实验留下来。
  actions:
    - theme: brand
      text: 阅读 C++ 学习路径
      link: /cpp/
    - theme: alt
      text: 查看工作区约定
      link: /guide/workspace
features:
  - title: 先说问题，再谈代码
    details: 每篇文章从可观察的问题开始，保留最小复现、实验结果和适用边界。
  - title: 让代码表达意图
    details: 参考整洁代码的实践：命名清楚、函数短小、边界明确，减少读者需要猜测的内容。
  - title: 每个项目都能独立重建
    details: CMake、README 和源代码属于项目自身，知识库记录为什么这样组织以及何时改变它。
---

## 这本 Wiki 记录什么

Kervein Wiki 是工作区的长期记忆：它不替代源码，而是解释源码背后的问题、取舍和验证方式。

当前从 cpp/10_learning 开始，沿着三个问题阅读：

1. [怎样让代码既好写又不容易误用？](/cpp/001-syntactic-sugar)
2. [怎样让对象自己守住状态规则？](/cpp/002-encapsulation)
3. [什么时候使用 struct，什么时候使用 class？](/cpp/003-struct-vs-class)

> 文章中的“整洁”不是装饰性的格式，而是降低理解成本：下一位读者应该能在不询问作者的情况下，运行实验并解释结论。
