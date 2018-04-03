<template>
  <div>
  <el-button @click="handleDownload">测试导出</el-button>
  </div>
</template>

<script>
export default {
  name: 'test',
  data () {
    return {
      list: [
        {
          id: 1,
          title: '标题1'
        },
        {
          id: 2,
          title: '标题2'
        }
      ],
      filename: 'excel'
    }
  },
  methods: {

    handleDownload () {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', 'Title']
        const filterVal = ['id', 'title']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel(tHeader, data, this.filename)
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped>

</style>
