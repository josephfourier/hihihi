<template>
  <div class="zjy-app echart">
    <zjy-table-search>
      <search-select label="院系" :options="facultyList" :value.sync="facultyCode"></search-select>
      <search-button @query="searchFilter"></search-button>
    </zjy-table-search>

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
          title="各类奖学金获得人数占比"
          :data="types"
        ></pie-chart>
      </div>
    </div>

  </div>

</template>

<script>
import ZjyTableSearch from '@/components/table-search'
import SearchInput from '@/components/table-search/search-input'
import SearchButton from '@/components/table-search/search-button'
import SearchSelect from '@/components/table-search/search-select'
import PieChart from '@/components/echart/pieChart'
import api from './api'
export default {
  name: 'index',
  data () {
    return {
      facultyCode: '',
      facultyList: [],
      t: ' 获取奖学金人数比例',
      title: '请选择院系',
      // 奖学金，个人、班级、院系荣誉称号和违纪处分 - 1,2,3,4,5
      query: {
        category: 1,
        facultyCode: '',
        applyYear: 2018
      },
      // 奖学金分类
      types: [],

      data: [
        // {value: 335, name: '获取奖学金人数50%'},
        // {value: 310, name: '未获取奖学金人数50%'}
      ]
    }
  },
  components: {
    PieChart,
    ZjyTableSearch,
    SearchInput,
    SearchButton,
    SearchSelect
  },
  computed: {
    legendData () {
      return  this.data.map(i => {
        return i.name
      })
    }
  },
  methods: {
    searchFilter () {
      this.query.facultyCode = this.facultyCode
      api.queryStatistical(this.query).then(response => {
        if (response.code !== 1) {
          this.$alert('获取数据失败')
        } else {
          this.title = this.facultyList.find(i => i.value === this.facultyCode).label + this.t

          this.types = response.data.classifyProportionDtos.map(i => {
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
              name: i.name + ' ' + (+i.value) / sum * 100 + '%'
            }
          }).filter(i => i.value !== 0)
        }
      })
    }
  },
  created () {
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
  watch: {
    facultyCode (val) {

    }
  }
}
</script>

<style scoped lang="scss">
.charts {
  background-color: #eef1f5;
  overflow: hidden;
  height: 100%;
  position: fixed;
  width: 100%;
  overflow: hidden;
  left: 160px;
  .mychart {
    width: 500px;
    height: 380px;
    float: left;
    background-color: #fff;
    margin: 20px;
    .chart {
      margin: 0 auto;
    }
  }
}
</style>
