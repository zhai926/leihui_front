<template>
  <div class="hello">
    <header-bar @changeCollapsed = "changeCollapsed" ></header-bar>
     
    <!--列表-->
    <el-col :span="24" class="main"> 
            <div  class="aside">
              <left-aside :collapsed ="collapsed"></left-aside>
            </div>
            <div  class="section">
                  
                  <transition :name="transitionName" mode="out-in">  
                        <router-view></router-view>
                  </transition>
              </div>
      </el-col>
      <el-col class="footer">
          

      </el-col>
  </div>
</template>

<script>
import headerBar from './header'
import leftAside from './aside'
// import breadCrunmb from './breadrumb'

export default {
  name: 'hello',
  data() {
    return {
      collapsed:false,
      transitionName:'transitionName'
    }
  },
  watch: {
    '$route' (to, from) {
      const toPage = to.meta.page
      const fromPage = from.meta.page
      console.log(toPage+'|'+fromPage)
      this.transitionName = toPage > fromPage ? 'slide-top':'slide-bottom'
    }
  },
  computed:{
   
  },
  components :{ headerBar,leftAside },
  methods:{
    // 监控头部的点击事件
      changeCollapsed(count){
        this.collapsed = count
      }
       
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

.del_btn {
  color: #20A0FF;
  cursor: pointer;
  font-size: 14px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.table_row {
  border: solid #666;
  border-width: 1px 0 0 0;
  padding: 10px 0;
}
.main{
   display: flex;
  -webkit-display:flex;
  -ms-display:flex;
  position: absolute;
  top: 70px;
  bottom: 0;

}

.section{
  flex-grow: 1;  
  -webkit-flex-grow: 1;
  -ms-flex-grow: 1;
  max-width:calc(100% - 260px);
  padding:10px 20px;
  overflow: hidden;
  overflow-y:auto;
}
.aside{
  max-width:230px;
}
.table_con {
  border: solid #666;
  border-width: 0 1px 1px 1px;
}

.el-pagination {
  text-align: right;
  margin-top: 10px;
}
.breadcrumb{
  padding: 10px 0;
  
}

.slide-top-enter, .slide-bottom-leave-active {
  opacity: 0;
  -webkit-transform: translate(0,50px);
  transform: translate(0,50px);
  transition:all 0.3s;
}
.slide-top-leave-active, .slide-bottom-enter {
  opacity: 0;
  -webkit-transform: translate(0,-50px);
  transform: translate(0,-50px);
   transition:all 0.3s;
}

</style>
