module.exports = {
  base: '/wx_calendar/',
  title: '小历同学',
  description: '在2.0中使用了插件系统，按需引入对应功能插件',
  head: [
    [
      'script',
      { src: 'https://hm.baidu.com/hm.js?aa798833bfba6405a36b03d0fc38a3da' }
    ]
  ],
  themeConfig: {
    sidebarDepth: 2,
    lastUpdated: 'Last Updated',
    nav: [
      {
        text: '文档版本',
        items: [
          {
            text: '1.x',
            link: '/v1/guide/'
          },
          {
            text: '2.0',
            link: '/v2/guide/'
          }
        ]
      }
    ],
    sidebar: {
      '/v1/': ['guide', 'api', 'multiple', 'template', 'datepicker'],
      '/v2/': ['guide', 'plugin', 'api', 'design']
    },
    repo: 'treadpit/wx_calendar',
    repoLabel: '查看源码',
    docsBranch: 'plugin-mode',
    editLinks: true,
    editLinkText: '帮助我改善此页面！'
  }
}
