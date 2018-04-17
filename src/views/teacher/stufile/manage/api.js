import ajax from '@/utils/ajax'

const download = (data, fileName) => {
  if (!data) return

  let url = window.URL.createObjectURL(new Blob([data]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)

  link.click()
}
export default {
  ajaxDownload (url, data, fileName) {
    return new Promise((resolve, reject) => {
      ajax({
        method: 'get',
        url: url,
        data: data,
        responseType: 'blob'
        // transformResponse: res => {
        //   return res
        // }
      }).then(res => {
        console.log(res)
        if (res.type === 'application/x-xls') {
          download(res, fileName)
          resolve()
        } else {
          reject(new Error(res))
        }
      }).catch(error => console.log(error))
    })
  }
}
