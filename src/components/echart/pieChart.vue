<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'pieChart',
  data () {
    return {
      chart: null,
      innerData: [],
      innerColor: [],
      option: {
        tooltip: {
          trigger: 'item',
          // {a} series - name
          // formatter: '{a} <br/>{b}: {c} ({d}%)'
          formatter: (params) => {
            return params.name + ' ' + params.data.value + ' (' + params.percent + ')%'
          }
        },
        color: this.innerColor,
        // 标题
        title: {
          show: true,
          text: this.title,
          top: 20,
          x: 'center',
          textStyle: {
            fontSize: 14,
            color: '#333'
          }
        },
        legend: {
          x: 'center',
          y: 'bottom',
          itemHeight: 10,
          data: this.legendData
        },
        series: [
          {
            name: '',
            type: 'pie',
            center: ['50%', '45%'],
            radius: ['60%', '65%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.innerData
          }
        ]
      }
    }
  },
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '350px'
    },
    height: {
      type: String,
      default: '380px'
    },
    title: {
      type: String,
      default: 'title'
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    color: {
      type: Array,
      default () {
        return []
      }
    },
    seriesName: {
      type: String,
      default: 'series-name'
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  computed: {
    legendData () {
      return this.data.map(i => {
        return i.name
      })
    }
  },
  methods: {
    initChart () {
      this.chart = echarts.init(document.getElementById(this.id))
      // this.option = {
      //   tooltip: {
      //     trigger: 'item',
      //     // {a} series - name
      //     // formatter: '{a} <br/>{b}: {c} ({d}%)'
      //     formatter: (params) => {
      //       return params.name.replace(/[0-9%]/gi, '') + params.data.value + ' (' + params.percent + ')%'
      //     }
      //   },
      //   color: this.innerColor,
      //   // 标题
      //   title: {
      //     show: true,
      //     text: this.title,
      //     top: 20,
      //     x: 'center',
      //     textStyle: {
      //       fontSize: 14,
      //       color: '#333'
      //     }
      //   },
      //   legend: {
      //     bottom: 20,
      //     left: 'center',
      //     data: this.legendData
      //   },
      //   series: [
      //     {
      //       name: '',
      //       type: 'pie',
      //       radius: ['65%', '70%'],
      //       avoidLabelOverlap: false,
      //       label: {
      //         normal: {
      //           show: false,
      //           position: 'center'
      //         },
      //         emphasis: {
      //           show: true,
      //           textStyle: {
      //             fontSize: '12',
      //             fontWeight: 'bold'
      //           }
      //         }
      //       },
      //       labelLine: {
      //         normal: {
      //           show: false
      //         }
      //       },
      //       data: this.innerData
      //     }
      //   ]
      // }
      this.chart.setOption(this.option)
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        if (val && val.length === 0) {
          this.innerData = [
            {
              value: 0,
              name: '暂无数据'
            }
          ]
          this.innerColor = ['#0aacf8']
        } else {
          this.innerColor = ['#37c6d4', '#8b6aff', '#0593fd']
          this.innerData = val
        }
        this.option.title.text = this.title
        this.option.color = this.innerColor
        this.option.series[0].data = this.innerData

        if (this.chart) { this.chart.setOption(this.option) }
      }
    }
    // innerData: {
    //   deep: true,
    //   handler (val) {
    //     this.option.series.data = val
    //     this.option = {
    //       tooltip: {
    //         trigger: 'item',
    //         formatter: (params) => {
    //           return params.name.replace(/[0-9%]/gi, '') + params.data.value + ' (' + params.percent + ')%'
    //         }
    //       },
    //       color: this.innerColor,
    //       // 标题
    //       title: {
    //         show: true,
    //         text: this.title,
    //         top: 20,
    //         x: 'center',
    //         textStyle: {
    //           fontSize: 14,
    //           color: '#333'
    //         }
    //       },
    //       legend: {
    //         bottom: 10,
    //         left: 'center',
    //         data: this.legendData
    //       },
    //       series: [
    //         {
    //           name: '',
    //           type: 'pie',
    //           radius: ['65%', '70%'],
    //           avoidLabelOverlap: false,
    //           label: {
    //             normal: {
    //               show: false,
    //               position: 'center'
    //             },
    //             emphasis: {
    //               show: true,
    //               textStyle: {
    //                 fontSize: '12',
    //                 fontWeight: 'bold'
    //               }
    //             }
    //           },
    //           labelLine: {
    //             normal: {
    //               show: false
    //             }
    //           },
    //           data: val
    //         }
    //       ]
    //     }
    //     this.chart.setOption(this.option)
    //   }
    // },
    // color (val) {
    //   this.innerColor = val
    // }
  }
}
</script>

<style scoped>
</style>
