---
layout: home
hero:
  name: Kervein Wiki
  text: 工程知识，写给正在构建的人
  tagline: 从 C++ 学习到团队实践，记录可运行、可解释、可复用的答案。
  image:
    src: /assets/logo_kervein.png
    alt: Kervein Wiki
  actions:
    - theme: brand
      text: 开始学习
      link: /cpp/
    - theme: alt
      text: 加入 Discord
      link: https://discord.gg/gFbrZEZBH
features:
  - title: 学习路径
    details: 从可运行的小项目出发，把语言特性变成可以验证的实验。
  - title: 工程约定
    details: 记录目录、构建、命名和边界，让团队协作少一点猜测。
  - title: 开放社区
    details: 公开文章、源码和讨论，欢迎在 Discord 一起把答案写得更好。
---

<div class="wiki-welcome">
  <span class="wiki-kicker">KERVEIN WIKI</span>
  <h2>从一个清楚的入口开始</h2>
  <p>这里是 Kervein 的开放知识库。先找到你要解决的问题，再沿着项目、文章和实验结果继续深入。</p>
</div>

<section class="wiki-section">
  <div class="wiki-section-heading">
    <div>
      <span class="wiki-kicker">QUICK START</span>
      <h2>快速入口</h2>
    </div>
    <p>不需要先读完所有内容，选择最接近当前任务的入口即可。</p>
  </div>
  <div class="wiki-card-grid">
    <a class="wiki-card" href="/cpp/">
      <span class="wiki-card-index">01</span>
      <h3>C++ 学习路径</h3>
      <p>用三个小项目理解语法边界、封装和类型设计。</p>
      <span class="wiki-card-link">开始阅读 →</span>
    </a>
    <a class="wiki-card" href="/guide/workspace">
      <span class="wiki-card-index">02</span>
      <h3>工作区约定</h3>
      <p>了解项目如何分类、构建，什么时候应该独立成库。</p>
      <span class="wiki-card-link">查看约定 →</span>
    </a>
    <a class="wiki-card" href="/notes/record-template">
      <span class="wiki-card-index">03</span>
      <h3>开发记录模板</h3>
      <p>把问题、最小复现、观察和结论写成下一次能复用的记录。</p>
      <span class="wiki-card-link">使用模板 →</span>
    </a>
  </div>
</section>

<section class="wiki-section">
  <div class="wiki-section-heading">
    <div>
      <span class="wiki-kicker">FEATURED NOTES</span>
      <h2>精选文章</h2>
    </div>
    <a class="wiki-section-link" href="/cpp/">浏览全部 C++ 内容 →</a>
  </div>
  <div class="wiki-feature-list">
    <a class="wiki-feature" href="/cpp/001-syntactic-sugar">
      <div class="wiki-feature-number">01</div>
      <div>
        <h3>语法糖与语法盐</h3>
        <p>用糖让正确的代码更像人的语言，用盐让危险的转换必须经过同意。</p>
      </div>
      <span>阅读 →</span>
    </a>
    <a class="wiki-feature" href="/cpp/002-encapsulation">
      <div class="wiki-feature-number">02</div>
      <div>
        <h3>封装不是 private</h3>
        <p>让对象自己守住不变性，把状态和改变状态的规则放回同一个边界。</p>
      </div>
      <span>阅读 →</span>
    </a>
    <a class="wiki-feature" href="/cpp/003-struct-vs-class">
      <div class="wiki-feature-number">03</div>
      <div>
        <h3>struct 还是 class</h3>
        <p>不要凭习惯选择关键字，用类型是否拥有不变性来决定公开程度。</p>
      </div>
      <span>阅读 →</span>
    </a>
  </div>
</section>

<section class="wiki-community">
  <div>
    <span class="wiki-kicker">JOIN THE COMMUNITY</span>
    <h2>一起把知识写得更好</h2>
    <p>发现错误、补充案例，或者只是想聊聊正在构建的东西？欢迎加入 Kervein Discord。</p>
  </div>
  <div class="wiki-community-actions">
    <a class="wiki-community-button" href="https://discord.gg/gFbrZEZBH">加入 Discord →</a>
    <a class="wiki-community-link" href="https://veic.tech/">访问 veic.tech →</a>
  </div>
</section>

<div class="wiki-home-note">
  Kervein Wiki 的文章会跟随源码和实验一起更新。结论不追求“看起来正确”，而追求可以运行、可以解释、可以复现。
</div>
