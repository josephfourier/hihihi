
```

### Attribute
props: [
        {
          index: true,
          select: false,
          indexStart: 1
          indexLabel: '序号',
          indexWidth: 200,
          selectWidth: 105
        },
        {
          label: '账号',
          prop: 'username',
          width: '300',
          formatter: this.statusFormat
        },
        {
          label: '操作',
          width: '200',
          operators: [
            {
              label: '查看',
              render: true,
              cmd: 'view',
              formatter (row, cellValue)
            }
          ]
        }
      ]
