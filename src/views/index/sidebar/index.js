import Sidebar from './Sidebar'
import { mapGetters } from 'vuex'

export default {
  render (h) {
    return (
      <Sidebar routes={this.routes}></Sidebar>
    )
  },
  computed: {
    ...mapGetters(['routes'])
  },
  components: {
    Sidebar
  }
}
