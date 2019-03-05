<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
       <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html,body{
  width:100%;
  height:100%;
}
body{
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Microft YaHei', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
   width:100%;
   height:100%;
  color: #2c3e50;
}
.router-fade-enter-active, .router-fade-leave-active {
      transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
      opacity: 0;
  }
   
  tbody{
    text-align: left;
  }
</style>
