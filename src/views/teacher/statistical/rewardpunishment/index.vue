<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="类别" :options="types" :value.sync="category"></search-select>
      <search-select label="范围" :options="facultyList" :value.sync="facultyCode"></search-select>
      <search-select label="年份" :options="years" :value.sync="applyYear"></search-select>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="echart">
      <div class="charts">
        <div class="mychart">
          <pie-chart
            :title="title"
            :data="data"
          ></pie-chart>
        </div>
        <div class="mychart">
          <pie-chart
            id="chart2"
            :data="value"
            :title="title2"
          ></pie-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ZjyTableSearch from '@/components/table-search'
import SearchButton from '@/components/table-search/search-button'
import SearchSelect from '@/components/table-search/search-select'
import PieChart from '@/components/echart/pieChart'

import properties from './properties'
import api from './api'

export default {
  name: 'index',
  data () {
    return {
      types: properties.types,
      category: '',
      facultyList: [],
      facultyCode: '',
      years: properties.optionsYears,
      applyYear: '',
      query: properties.query,

      data: [],
      value: []
    }
  },
  methods: {
    searchFilter () {
      this.query.facultyCode = this.facultyCode
      this.query.applyYear = this.applyYear
      this.query.category = this.category
      this.search()
    },

    search () {
      if (!this.query.category) {
        MSG.warning('请选择类别')
        return
      }
      api.queryStatistical(this.query).then(response => {
        if (response.code !== 1) {
          this.$alert('获取数据失败')
        } else {
          console.log(response)

          this.value = response.data.classifyProportionDtos.map(i => {
            return {
              value: +i.value,
              name: i.name
            }
          })

          let sum = response.data.peopleProportionDto.map(i => {
            return +i.value
          }).reduce((total, currentValue) => total + currentValue, 0)

          this.data = response.data.peopleProportionDto.map(i => {
            return {
              value: +i.value,
              name: i.name + ' ' + ((+i.value) / sum * 100).toFixed(2) + '%'
            }
          }).filter(i => i.value !== 0)
        }
      })
    }
  },

  computed: {
    title () {
      switch (this.query.category) {
        case 1: return '获得奖学金人数占比'
        case 2: return '获得个人荣誉称号人数占比'
        case 3: return '获得班级荣誉称号人数占比'
        case 4: return '获得院系荣誉称号人数占比'
        case 5: return '违纪处分人数占比'
        default: return ''
      }
    },

    title2 () {
      switch (this.query.category) {
        case 1: return '各类奖学金人数占比'
        case 2: return '各类个人荣誉称号人数占比'
        case 3: return '各类班级荣誉称号人数占比'
        case 4: return '各类院系荣誉称号人数占比'
        case 5: return '各类违纪处分人数占比'
        default: return ''
      }
    }
  },

  mounted () {
    api.queryFacultyList().then(response => {
      if (response.code !== 1) {
        this.$alert('获取院系失败')
      } else {
        this.facultyList  = response.data.map(i => {
          return {
            label: i.facultyName,
            value: i.facultyCode
          }
        })
      }
    })
  },
  components: {
    ZjyTableSearch,
    SearchButton,
    SearchSelect,

    PieChart
  }
}
</script>

<style scoped lang="scss">
  .echart {
    height: 100%;
    position: fixed;
    overflow: hidden;
    left: 0;
    padding-left: 160px;
    right: 0;
  }
  .charts {
    background-color: #eef1f5;
    overflow: hidden;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-around;

    .mychart {
      width: 500px;
      height: 380px;
      /*float: left;*/
      background-color: #fff;
      margin: 20px;
      .chart {
        margin: 0 auto;
      }
    }
  }
</style>
