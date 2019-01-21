export default function () {
  return [
    {
      title: 'Dashboard',
      to: { name: 'Dashboard' },
      icon: 'multiline_chart',
    },
    {
      title: '漏洞扫描',
      tag: true,
    },
    {
      title: 'PoC Scanner',
      icon: 'filter_center_focus',
      items: [
        {
          title: '新建任务',
          icon: 'add',
          to: { name: 'PocNewScan' },
        },
        {
          title: '任务列表',
          icon: 'list',
          to: { name: 'PocScans' }
        },
        {
          title: '插件管理',
          icon: 'list',
          to: { name: 'PocPluginList' }
        },
      ],
    },
    {
      title: 'Nessus Scanner',
      to: { name: 'NessusNewScan' },
      icon: 'navigation',
    },
    {
      title: '信息收集',
      tag: true,
    },
    {
      title: '子域名收集',
      to: { name: 'DomainBuster' },
      icon: 'domain',
    }
  ];
}
