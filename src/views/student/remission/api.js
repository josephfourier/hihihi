import ajax from '@/utils/ajax'
// import { selfMerge } from '@/utils'

// const download = (data, fileName) => {
//   if (!data) return

//   let url = window.URL.createObjectURL(new Blob([data]))
//   let link = document.createElement('a')
//   link.style.display = 'none'
//   link.href = url
//   link.setAttribute('download', fileName)
//   document.body.appendChild(link)

//   link.click()
// }
export default {
  queryFileList (funcationClass) {
    return ajax.get('/manage/swmsNotice/swmsNoticeReadScope/' + funcationClass)
  }
}
