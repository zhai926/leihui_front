<template>
    <div>
       
        <!--<row-bar :rowBar='rowBar'></row-bar>-->
        <el-col :span="24" class="content" >
        <!--<router-view ></router-view>-->
        <banner-manage></banner-manage>
        </el-col>
        </div>
</template>

<script>
// import rowBar from '@/components/common/top_list'
import bannerManage from './children/list'
export default {
    data() {
        return {
            // rowBar:{
            //   'rootUrl':this.$route.path
            // }
        }
    },
    components:{
        bannerManage 
    }
}
</script>

<style>
.content{
    width:100%;
    min-height: 100%;
    padding:20px 30px;
}
</style>
