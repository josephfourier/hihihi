<template>
  <div class="zjy-app">
    <zjy-table-search>
      <search-date label="年份" :value.sync="applyYear"></search-date>
      <search-select label="类别" :options="types" :value.sync="category" :all="false"></search-select>
      <search-select label="范围" :options="myFacultyList" :value.sync="facultyCode"></search-select>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

    <div :class="['echart', {isCollapse: isCollapsed}]" v-loading="loading">
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
import SearchDate from '@/components/table-search/search-date'

import properties from './properties'
import api from './api'
import { mapGetters } from 'vuex'

export default {
  name: 'index',
  inject: ['isCollapse'],
  data () {
    return {
      types: properties.types,
      category: '',
      // facultyList: [],
      facultyCode: '',
      applyYear: new Date().getFullYear().toString(),
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

          let sum = response.data.peopleProportionDto.map(i => {
            return +i.value
          }).reduce((total, currentValue) => total + currentValue, 0)

          this.data = response.data.peopleProportionDto.map(i => {
            return {
              value: +i.value,
              name: i.name
            }
          }).filter(i => i.value !== 0)
        }
      }).finally(_ => {
        this.loading = false
      })
    }
  },

  computed: {
    ...mapGetters(['facultyList', 'isCollapsed']),
    myFacultyList () {
      return this.facultyList.map(i => {
        return {
          label: i.facultyName,
          value: i.facultyCode
        }
      })
    },
    title () {
      switch (this.query.category) {
        case 1: return '获得奖学金人数占比'
        case 2: return '获得个人荣誉称号人数占比'
        case 3: return '获得班级荣誉称号班级占比'
        case 4: return '获得院系荣誉称号院系占比'
        case 5: return '违纪处分人数占比'
        default: return ''
      }
    },

    title2 () {
      switch (this.query.category) {
        case 1: return '各类奖学金人数占比'
        case 2: return '各类个人荣誉称号人数占比'
        case 3: return '各类班级荣誉称号班级占比'
        case 4: return '各类院系荣誉称号院系占比'
        case 5: return '各类违纪处分人数占比'
        default: return ''
      }
    }
  },

  mounted () {
    this.$store.dispatch('setFacultyList')
  },
  components: {
    ZjyTableSearch,
    SearchButton,
    SearchSelect,
    SearchDate,

    PieChart
  },
  destroyed () {
    this.query.facultyCode = ''
    this.query.category = ''
    this.query.applyYear = new Date().getFullYear().toString()
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
    &.isCollapse {
      padding-left: 54px;
    }
    transition: all .2s;
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
