export default function () {
  return [
    {
      title: 'Dashboard',
      to: { name: 'Dashboard' },
      icon: 'multiline_chart',
    },
    {
      title: 'Vulnerabilities',
      tag: true,
    },
    {
      title: 'PoC Scanner',
      icon: 'filter_center_focus',
      items: [
        {
          title: 'New scan',
          icon: 'add',
          to: { name: 'PocNewScan' },
        },
        {
          title: 'Tasks',
          icon: 'list',
          to: { name: 'PocScans' }
        },
        {
          title: 'Plugins',
          icon: 'list',
          to: { name: 'PocPluginList' }
        },
        {
          title: 'Vulnerabilities',
          icon: 'list',
          to: { name: 'PocVulList' }
        },
      ],
    },
    {
      title: 'Pentest tools',
      tag: true,
    },
    {
      title: 'XSS Platform',
      to: { name: 'XssPlatform' },
      icon: 'navigation',
    },
    {
      title: 'HTTP Request',
      to: { name: 'HttpLog' },
      icon: 'navigation',
    },
    {
      title: 'Json Hijacker',
      to: { name: 'JsonHijacker' },
      icon: 'navigation',
    },
    {
      title: 'Information gathering',
      tag: true,
    },
    {
      title: 'Discovery',
      to: { name: 'DiscoveryTask' },
      icon: 'domain',
    },
    {
      title: 'Search',
      to: { name: 'AssetsSearch' },
      icon: 'domain',
    },
  ];
}
