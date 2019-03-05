<template>
    <div>
       
        <!--<row-bar :rowBar="rowBar"></row-bar>-->
        <!--<router-view ></router-view>-->
        <main-list></main-list>
        </div>
</template>

<script>
import mainList from './children/list'
export default {
    data() {
        return {
            rowBar:{
              'rootUrl':this.$route.path,
              'add':'false'
            }
        }
    },
    components:{
       mainList
    }
}
</script>

<style>

</style>
