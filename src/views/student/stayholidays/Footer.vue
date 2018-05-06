<template>
  <div class="zjy-footer" v-if="data.dataStatus === '0'">
    <zjy-button type="plain" @click="$emit('delete', data, steps)" v-if="hasPermission('swms:stayholidays:delete')">删除申请</zjy-button>
    <zjy-button type="primary" @click="handleClick" v-if="hasPermission('swms:stayholidays-stu:update')">修改</zjy-button>
  </div>
</template>

<script>
import ZjyButton from '@/components/button'
import { mapGetters } from 'vuex'
export default {
  name: 'zjy-footer',
  props: {
    data: Object,
    steps: Array,
    reason: String,
    type: String,
    visible: Boolean
  },
  methods: {
    handleClick () {
      this.data.stayReason = this.reason
      this.data.holidayId = this.type
      this.data.holidayName = this.holidayTypeList.find(i => i.valueKey == this.type).valueName
      this.$emit('update', this.data, this.steps)
    }
  },
  components: {
    ZjyButton
  },
  computed: {
    ...mapGetters(['holidayTypeList'])
  }
}
</script>

<style scoped>

</style>
