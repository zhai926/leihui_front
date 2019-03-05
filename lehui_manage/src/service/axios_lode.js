import axios from 'axios'
import { Loading, Message } from 'element-ui'
// 超时时间
axios.defaults.timeout = 5000
// let AUTH_TOKEN = {}
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// http请求拦截器
var loadinginstace
axios.interceptors.request.use(config => {


  // element ui Loading方法
  loadinginstace = Loading.service({ fullscreen: true })
  return config
}, error => {
  loadinginstace.close()
  Message.error({
    message: '加载超时'
  })
  return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => {// 响应成功关闭loading
  loadinginstace.close()
  return data
}, error => {
  if(error.response){
  switch (error.response.status) {
    case 401:
        alert("您的权限不够")
  }
}
  loadinginstace.close()
  Message.error({
    message: '加载失败'
  })
  return Promise.reject(error)
})

export default axios