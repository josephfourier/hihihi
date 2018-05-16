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
      'class': {
        'list-item': true
      },
      on: {
        click: this.handleClick
      }
    }
    return (
      <div {...data}><p>{this.data.fileName}</p></div>
    )
  }
}
