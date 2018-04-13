<template>
  <p @click="handleClick">{{data.permissionName}}</p>
</template>

<script>
export default {
  name: 'MyList',
  props: {
    data: Object
  },
  methods: {
    handleClick () {
      this.$emit('click', this.data.dataUid, this.data.permissionId)
    }
  }
}
</script>

<style scoped>

</style>
