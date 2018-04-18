export default {
  data () {
    return {
      loading: true
    }
  },
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '450px'
    },
    src: String
  },
  methods: {
    handleOnLoad () {
      this.loading = false
      // console.log(document.querySelector('.zjy-preview--iframe').contentWindow)
      // const cw = document.querySelector('.zjy-preview--iframe').contentWindow
    }
  },
  render (h) {
    const BASE = 'https://view.officeapps.live.com/op/view.aspx?src='
    const data = {
      attrs: {
        width: this.width,
        height: this.height,
        src: BASE + encodeURIComponent(this.src),
        frameborder: '0',
        ref: 'iframe'
      },
      on: {
        load: () => {
          this.handleOnLoad()
        }
      },
      class: {
        'zjy-preview--iframe': true
      }
    }
    return (
      <div class="preview" v-loading={this.loading}>
        <iframe {...data}></iframe>
        {this.$slots.default}
      </div>
    )
  }
}
