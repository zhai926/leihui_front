<template>
  <el-col :span='24'  class="row_bar">
       <ul>
           <li 
             v-for="item in items"
            @click="$router.push(item.url)" 
           :class="$route.path == item.url?'selected':''"
           v-if="item.name != '编辑'">{{item.name}}</li>
           <li 
             v-for="item in items"
            @click="$router.push(item.url)" 
           :class="$route.path == item.url?'selected':''"
           v-if="item.name == '编辑'" v-show="hidden">{{item.name}}</li>
       </ul>
  </el-col>
</template>

<script>
import {getStore} from '@/config/storage'
export default {
    data() {
        return {
            baseUrl:'',
            items:[],
            hidden:false
        }
    },
     props:{
         rootUrl:{
             type:String,
             default:''
         },
         rowBar:{
             type:Object,
             default:function() {
                 return {
                   
                 }
             }
         }
     },
    computed:{
        getItems() {
            let routes = this.rowBar.rootUrl.split('/')
            console.log(routes)
            this.baseUrl = routes[2]
            this.items=[
                {name:'列表',url:'/index/'+this.baseUrl+'/list',hidden:true},
                {name:'新增',url:'/index/'+this.baseUrl+'/add',hidden:true},
                {name:'编辑',url:'/index/'+this.baseUrl+'/edit',hidden:this.hidden}
            ]
            if(routes.length == 3){
                this.$router.push(this.items[0].url)
            }
        }
    },
    
   
    watch: {
    '$route' (to, from) {
      const toPath = to.path  
      console.log(toPath)
     if(toPath.indexOf('edit') > -1){
         this.hidden=true
     }else{
          this.$store.dispatch('closeEdit').then((res) => {
               this.hidden=false
             })

     }
     let routes = toPath.split('/')
     if(routes.length == 3 && routes[2] == 'news'){
        this.$router.push(toPath+'/list')
     }
     console.log(this.hidden)
    }
    },
   mounted() {
       this.getItems
       let edit = this.$store.state.edit == 'false'?false:true
       console.log(getStore('edit'))
       if(getStore('edit')){
            edit = getStore('edit') == 'false'?false:true
       }
       
       this.hidden = edit
       
    }
}
</script>

<style>
.row_bar{
    height:30px;
    line-height: 30px;
}
.row_bar ul {
    width:100%;
}
.row_bar ul li{
    display: inline-block;
    margin:0 20px;
    padding: 0 10px;
    cursor: pointer;
}
.row_bar ul li.selected{
    border-bottom: 2px solid #20a0ff;
}
</style>
