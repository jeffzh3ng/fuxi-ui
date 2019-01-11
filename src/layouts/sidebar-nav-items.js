export default function () {
  return [
    {
      title: 'Test Page',
      to: {
        name: 'vue-test-1',
      },
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: '',
    },
    {
      title: 'title',
      tag: true,
    },
    {
      title: 'sub item',
      htmlBefore: '<i class="material-icons">edit</i>',
      items: [
        {
          title: 'item1',
          to: {
            name: 'vue-test-2',
          },
        },
      ],
    },
    {
      title: '中文分割',
      tag: true,
    },
    {
      title: '中文测试',
      to: {
        name: 'vue-test-3',
      },
      htmlBefore: '<i class="material-icons">bug_report</i>',
      htmlAfter: '',
    },
  ];
}
