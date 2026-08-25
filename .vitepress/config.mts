import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kervein Wiki',
  description: 'Kervein 的工程知识库、C++ 学习与团队实践',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
  ],
  themeConfig: {
    appearance: true,
    siteTitle: 'Kervein Wiki',
    nav: [
      { text: '首页', link: '/' },
      { text: 'veic.tech 主站', link: 'https://veic.tech/' },
      { text: 'C++ 学习', link: '/cpp/' },
      { text: '工作区约定', link: '/guide/workspace' },
      { text: 'Discord', link: 'https://discord.gg/gFbrZEZBH' },
      { text: 'GitHub', link: 'https://github.com/SuzuShigure/KerveinWiki' },
    ],
    sidebar: {
      '/cpp/': [
        {
          text: 'C++ 学习路径',
          items: [
            { text: '学习总览', link: '/cpp/' },
            { text: '01 · 语法糖与语法盐', link: '/cpp/001-syntactic-sugar' },
            { text: '02 · 封装与不变性', link: '/cpp/002-encapsulation' },
            { text: '03 · struct 还是 class', link: '/cpp/003-struct-vs-class' },
          ],
        },
        {
          text: '工作区参考',
          items: [
            { text: '创建 C++ 项目', link: '/guide/cpp-project' },
            { text: '工作区约定', link: '/guide/workspace' },
          ],
        },
      ],
      '/guide/': [
        {
          text: '工作区参考',
          items: [
            { text: '工作区约定', link: '/guide/workspace' },
            { text: '创建 C++ 项目', link: '/guide/cpp-project' },
          ],
        },
      ],
      '/notes/': [
        {
          text: '开发记录',
          items: [{ text: '记录模板', link: '/notes/record-template' }],
        },
      ],
    },
    outline: { level: [2, 3] },
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/gFbrZEZBH' },
      { icon: 'github', link: 'https://github.com/SuzuShigure/KerveinWiki' },
    ],
    footer: {
      message: 'Keep the code clear. Keep the boundary small.',
      copyright: 'Kervein Wiki',
    },
  },
})
