import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

nprogress.inc(0.2)
nprogress.configure({ easing: 'ease', speed: 300, showSpinner: false })

export default nprogress
