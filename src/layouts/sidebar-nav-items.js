export default function () {
  return [
    {
      title: 'Dashboard',
      to: { name: 'Dashboard' },
      icon: 'multiline_chart',
    },
    {
      title: 'Information Gathering',
      tag: true,
    },
    {
      title: 'Network Port',
      icon: 'navigation',
      items: [
        {
          title: 'New scan',
          icon: 'add',
          to: { name: 'NewPortScan' },
        },
        {
          title: 'Tasks',
          icon: 'add',
          to: { name: 'PortScanTasks' },
        }
      ]
    },
    {
      title: 'What Web',
      icon: 'navigation',
      items: [
        {
          title: 'Website Fingerprint',
          icon: 'add',
          to: { name: 'WebsiteIdentifies' },
        },
      ]
    },
    {
      title: 'Vulnerability Analysis',
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
      title: 'Exploitation Tools',
      tag: true,
    },
    {
      title: 'XSS Hunter',
      to: { name: 'XssPlatform' },
      icon: 'navigation',
    },
    {
      title: 'Jsonp Hijacking',
      to: { name: 'JsonHijackerTask' },
      icon: 'navigation',
    },
    {
      title: 'HTTP Logger',
      to: { name: 'HttpRequestLog' },
      icon: 'navigation',
    }
  ];
}
