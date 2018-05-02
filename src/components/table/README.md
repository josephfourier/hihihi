
```

### Attribute
props: [
        {
          index: true,
          select: false,
          indexStart: 1
          indexLabel: '序号',
          ihalign: 'center'
          shaling: 'center'
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

          operators: [
            {
              label: '查看',
              render: (row) => row.dataStatus === '1' || row.dataStatus === '2' 若不提供render则默认显示(true)，添加主要为有些操作据权限显示
              render: (row) => { return hasPermission('swms:approvaltempate-set:create') },
              cmd: 'view',
              formatter (row, cellValue)
            }
          ]
        }
      ]
# 当操作列大于2时，则宽160，否则100
# 只有一列时，则会居中对齐
