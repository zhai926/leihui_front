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
					<el-input v-model="filter.msg" placeholder="新闻标题" @keyup.enter.native="getNews('search')"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getNews('search')">查询</el-button>
				</el-form-item>
				
			</el-form>
		</el-col>
        <el-table :data="lists" highlight-current-row border  ref="multiple" v-loading="listLoading" @select="selectNew"  @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" :disabled="true" width="55">
            </el-table-column>
             <el-table-column type="expand" prop="img[0].path" label="图片展示" width="80"  sortable>
               <template scope="scope">
                   <img :src="scope.row.img[0].path" ></img>
               </template>
             </el-table-column>
            <el-table-column prop="id" label="id" width="200" sortable>
            </el-table-column>
            <el-table-column prop="title" label="新闻标题" min-width="240" >
            </el-table-column>
            <el-table-column prop="newsClass.name" label="所属分类" width="150" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="120"  sortable>
               <template scope="scope">
                    <!--<el-icon name="time"></el-icon>-->
                    <span style="margin-left: 10px">{{ scope.row.createTime | formatDate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)" :disabled="scope.row.img[0].path == ''">添加</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchAdd" :disabled="this.sels.length===0" style="margin-right:20px">批量添加</el-button>
            <span>每页10条，不足10条的为已被添加到展示新闻</span>
            <el-pagination layout="prev,pager,next" :page-size='pageSize' :total="total" @current-change="handleCurrentChange">
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
            pageSize: 10,
            page: 1,

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
            },
            toSame:[]

        }
    },
    props: {
        calSel: {
            type:Array,
            default:null
        }
    },
    watch: {
        calSel(val){
            // console.log(val)
            this.getNews()
        }
    },
    computed: {},
    components:{ },
    async mounted() {
        
        this.getNews()
        this.getClass()
    },
    methods: {
        selectNew(row,selection) {
          
            //console.log(selection)
            let _this = this
            _this.sels.forEach((item,index) => {
                if(item.img[0].path == ''){
                    _this.$message('本新闻没有展示图片，不能选为首页展示推荐，请先去添加展示图片吧！')
                    _this.sels.splice(index,1)
                }
            })
            console.log(this.sels)
        },
        getClass(){
            
            classList().then((res) => {
               if(res.data.state == 'success'){
                this.options = res.data.newsCalss.content
                // console.log(this.options)
               }
               
            })
        },
        getNews(data) {
            
            let _this = this
            if(data == 'search'){
                this.page = 1
            }
            let pageData = {
                classId:this.filter.classId,
                title:this.filter.msg,
                page: this.page-1,
                pageSize:this.pageSize
            }
            // console.log(pageData)
            this.listLoading = true
            newsList(pageData).then((res) => {
            //   console.log(res)
             this.listLoading = false
               if(res.data.state == 'success'){
              
                _this.lists = []
                _this.toSame = _this.$store.state.remeberSel
                // console.log(_this.toSame)
                _this.total = res.data.news.totalElements
                res.data.news.content.forEach((item,index) => {
                        let id=''
                        _this.toSame.forEach((child,num) => {
                            if(child == item.id){
                                console.log(index)
                               id=child
                            }
                        })
                        if(id == ''){
                            _this.lists.push(item)
                        }
                })
               }else if(res.data.state == 'error'){
                   this.lists = []
                   this.total = 0
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
       
        selsChange(sels) {
            // console.log(this.$store.state.remeberSel)
            this.sels = sels;
            console.log(sels)
        },
        batchAdd(){
        
        
        let para=[] 
        this.sels.forEach((item) => {
            para.push({
                id:item.id,
                title:item.title,
                bigPic:false
            })
        })
          let ids = this.sels.map(item => item.id).toString()
          
           this.$emit('addNews',para)
           
           this.$refs.multiple.clearSelection()
           
        },
       
    // 单个的新闻添加
        handleEdit(index, row) {
            let para = [{
                id:row.id,
                title:row.title,
                bigPic:false
            }]
            this.$emit('addNews',para)
             this.$refs.multiple.clearSelection()
             this.getNews()
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
