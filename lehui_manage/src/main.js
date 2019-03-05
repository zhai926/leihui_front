// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import  'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import tool from './assets/util.js'

import elementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/index.js'
// VueHtml5Editor 富文本编辑器在ie9及以下不兼容（formData未定义）
import VueHtml5Editor from 'vue-html5-editor'

// import '../static/ueditor/ueditor.config.js'
// import '../static/ueditor/ueditor.all.min.js'
// import '../static/ueditor/ueditor.parse.min.js'
// import '../static/ueditor//lang/zh-cn/zh-cn.js'


import { getStore } from './config/storage'

import axios from 'axios'
 
axios.defaults.timeout = 10000
axios.interceptors.request.use(
    config => {
        if (store.state.user.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            // csonsole.log(store.state.token)
            config.headers.token = `${store.state.user.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
});


 Vue.filter('formatDate',function(value){  
    
    if(value != '' && value != null && value != 'undefind'){
         let dates = new Date(parseInt(value))
         return tool.formatDate.format((dates),'yyyy-MM-dd')
    }else{
        return ''
    }
     
})

Vue.use(elementUI)
Vue.use(VueHtml5Editor,{
   
     showModuleName: true,
        image: {
            upload: {
                url:process.env.BASE_URL+'/upload',
                fieldName: 'file'//上传图片的file的name值
            },
            uploadHandler(responseText){
            //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
            var json = JSON.parse(responseText)
           return json[0]
        }
    },
    language: "zh-cn"
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
