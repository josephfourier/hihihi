<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-select label="类别" :options="types" :value.sync="category"></search-select>
      <search-select label="范围" :options="myFacultyList" :value.sync="facultyCode"></search-select>
      <search-select label="年份" :options="years" :value.sync="applyYear"></search-select>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div class="echart" v-loading="loading">
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
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  data () {
    return {
      types: properties.types,
      category: '',
      // facultyList: [],
      facultyCode: '',
      years: properties.optionsYears,
      applyYear: '',
      query: properties.query,

      loading: false,
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
      this.loading = true
      api.queryStatistical(this.query).then(response => {
        if (response.code !== 1) {
          MSG.warning('获取数据失败')
        } else {
          this.value = response.data.classifyProportionDtos.map(i => {
            return {
              value: +i.value,
              name: i.name
            }
          })

          // let sum = response.data.peopleProportionDto.map(i => {
          //   return +i.value
          // }).reduce((total, currentValue) => total + currentValue, 0)

          this.data = response.data.peopleProportionDto.map(i => {
            return {
              value: +i.value,
              name: i.name
            }
          }).filter(i => i.value !== 0)
        }
      }).finally (_ => {
        this.loading = false
      })
    }
  },

  computed: {
    ...mapGetters(['facultyList']),
    myFacultyList() {
      return this.facultyList.map(i => {
          return {
            label: i.facultyName,
            value: i.facultyCode
          }
      })
    },
    title () {
      switch (this.query.category) {
        case 1: return '获得困难补助人数占比'
        case 2: return '获得勤工助学人数占比'
        default: return ''
      }
    },

    title2 () {
      switch (this.query.category) {
        case 1: return '各类困难补助人数占比'
        case 2: return '各类勤工助学人数占比'
        default: return ''
      }
    }
  },

  mounted () {
    this.$store.dispatch('setFacultyList')
    // api.queryFacultyList().then(response => {
    //   if (response.code !== 1) {
    //     this.$alert('获取院系失败')
    //   } else {
    //     this.facultyList  = response.data.map(i => {
    //       return {
    //         label: i.facultyName,
    //         value: i.facultyCode
    //       }
    //     })
    //   }
    // })
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
      width: 45%;
      min-width: 500px;
      height: 380px;
      background-color: #fff;
      margin: 20px;
      .chart {
        margin: 0 auto;
      }
    }
  }
</style>
