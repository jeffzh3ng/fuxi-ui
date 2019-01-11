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
      title: 'Alioth Scanner',
      icon: 'filter_center_focus',
      items: [
        {
          title: '新建任务',
          icon: 'add',
          to: { name: 'AliothNewScan' },
        },
        {
          title: '任务列表',
          icon: 'list',
          to: { name: 'AliothScans' }
        }
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
