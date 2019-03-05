<template>
    <el-col :span="24">
        <!--查询工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
                <el-form-item>
                    <el-select v-model="filter.classId" clearable placeholder="请选择新闻分类">
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                     </el-select>
                </el-form-item>
				<el-form-item>
					<el-input v-model="filter.msg" placeholder="新闻标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getNews('search')">查询</el-button>
				</el-form-item>
				
			</el-form>
		</el-col>
        <el-table :data="lists" highlight-current-row border stripe v-loading="listLoading"  @selection-change="selsChange" style="width: 100%;">
            <!--<el-table-column type="selection" width="55">
            </el-table-column>-->
             <el-table-column type="expand" prop="img[0].path" label="图片展示" width="100"  sortable>
               <template scope="scope">
                   <img :src="scope.row.img[0].path" />
               </template>
             </el-table-column>
            <el-table-column prop="id" label="id" width="240" sortable>
            </el-table-column>
            <el-table-column prop="title" label="新闻标题" min-width="300" >
                <template scope="scope">
                    <a :href="local+'/#/list_detail/'+scope.row.id " target="_blank" style="color:#1f2d3d;">{{scope.row.title}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="newsClass.name" label="所属分类" width="180" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="120"  sortable>
               <template scope="scope">
                    <!--<el-icon name="time"></el-icon>-->
                    <span style="margin-left: 10px">{{ scope.row.createTime | formatDate }}</span>
                </template>
            </el-table-column>
           <!--<el-table-column type="expand" prop="img[0].path" label="图片展示" width="100"  sortable>
               <template scope="scope">
                   <img :src="scope.row.img[0].path" />
               </template>
             </el-table-column>-->
            
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <el-pagination layout="total,prev,pager,next" :current-page.sync="currentPage1" :page-size='pageSize' :total="total" @current-change="handleCurrentChange">
            </el-pagination>
         </el-col>
 

    </el-col>
</template>

<script>
// import util from '@/assets/comon'
import { newsList,classList,removeNews } from '@/service/getData'
export default {
    data() {
        return {
           filter:{
                msg: '',
                classId:''
           },
            currentPage1:1,
            pageSize: 20,
            page: 1,
            local:'',
            options:[],//分类

            listLoading: false,
            total: 0,
            lists: [],
            sels: [],//列表选中列
            
            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            editFormRules: {
					id: [
						{ required: true, message: '请输入账户名', trigger: 'blur' }
					]
            },
            //编辑界面数据
            editForm: {
                id: 0,
                name: '',
                sort:''
            },

            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            addFormRules: {
                name: [
                    { required: true, message: '分类名称不可为空', trigger: 'blur' }
                ]
                
            },
            //新增界面数据
            addForm: {
                sort:'',
                name: ''
            }

        }
    },
    computed: {},
    components:{ },
    async mounted() {
        this.local = window.location.protocol+ '//'+window.location.host
        console.log(this.local)
        this.getNews()
        this.getClass()
    },
    methods: {
        getClass(){
            classList().then((res) => {
               if(res.data.state == 'success'){
                this.options = res.data.newsCalss.content
                // console.log(this.options)
               }
               
            })
        },
        getNews(data) {
            if(data == 'search'){
                this.page = 1
                this.currentPage1 = 1
            }
            let pageData = {
                classId:this.filter.classId,
                title:this.filter.msg,
                page: this.page-1,
                pageSize:this.pageSize
            }
             console.log(pageData)
            this.listLoading = true
            newsList(pageData).then((res) => {
              console.log(res)
               this.listLoading = false
               if(res.data.state == 'success'){
                this.total = res.data.news.totalElements
                this.lists = res.data.news.content
               }else if(res.data.state == 'error'){
                    this.lists = []
                    this.total=0
               }
               
            })
        },
        async handleCurrentChange(val) {
            this.page = val
            this.getNews()
        },
        async handleSizeChange(val) {
            this.pageSize = val
            this.getNews()
        },
        handleDel (index,row) {
         
        this.$confirm('确认删除该记录吗？','提示',{
            type:'warning'
        }).then(() => {
            this.listLoding = true;
            let para = {id:row.id}
            // console.log(para)
            removeNews(para).then((res) => {
                console.log(res)
                if(res.data.state == 'success'){
                    this.getNews();
                    this.$message({
                        message:'删除成功',
                        type:'success'
                    })
                }else if(res.data == ''){
                    this.$message('登录超时，请重新登录')
                    this.$router.push({
                            path:'/login',
                            query:{redirect:this.$route.path}
                        })
                }else if(res.data.state =='error'){
                    this.$message('删除失败')
                }
                 this.listLoding = false;
                
                
            })
        })
             
        },
        selsChange(sels) {
            this.sels = sels;
            console.log(sels)
        },
        batchRemove(){
            let ids = this.sels.map(item => item.num).toString()
            console.log(ids)
            this.$confirm('确认删除该记录吗？','提示',{
            type:'warning'
        }).then(() => {
            this.listLoding = true;
            let para = {ids : ids}
            // batchremove(para).then((res) => {
            //      this.listLoding = false;
            //      this.$message({
            //          message:'删除成功',
            //          type:'success'
            //      })
            //      this.getUsers();
            // })
        })
    },
    // 编辑框的显示隐藏
        handleEdit(index, row) {
             this.$store.dispatch('openEdit').then((res) => {
               
                  this.$router.push({
                      path:'/index/news/edit',
                      query:{id:row.id}
                  })
             })
            this.editForm = Object.assign({},row)
            console.log(this.editForm)
        },
        handleAdd: function () {
				console.log('add')
				
		}
        


        
        
    }
}
</script>

<style>
.toolbar{
    padding:10px 20px;

}
.toolbar .el-pagination{
    float: right;
}
</style>
