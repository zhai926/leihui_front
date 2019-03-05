<template>
    <div>
       
        <row-bar :rowBar='rowBar'></row-bar>
        <el-col :span="24" class="content" >
        <router-view ></router-view>
        </el-col>
        </div>
</template>

<script>
import rowBar from '@/components/common/top_list'
export default {
    data() {
        return {
            rowBar:{
              'rootUrl':this.$route.path,
               edit:this.$store.state.edit
            }
        }
    },
    components:{
        rowBar
    },
    mounted() {
        console.log(this.$store.state.edit)
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
