export default {
  props: {
    data: Object
  },
  methods: {
    handleClick () {
      this.$emit('click', this.data)
    }
  },
  render (h) {
    const data = {
      on: {
        click: this.handleClick
      }
    }
    return (
      <p {...data}>{this.data.fileName}</p>
    )
  }
}
