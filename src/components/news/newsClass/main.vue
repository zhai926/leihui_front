<template>
    <el-col :span="24">
        <!--查询工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <!--<el-form-item>
    					<el-input v-model="filters.name" placeholder="用户名"></el-input>
    				</el-form-item>
    				<el-form-item>
    					<el-button type="primary" v-on:click="getUsers('page')">查询</el-button>
    				</el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table :data="lists" highlight-current-row border stripe v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="sort" label="排序" width="240" sortable>
            </el-table-column>
            <el-table-column prop="id" label="id" width="240" sortable>
            </el-table-column>
             
            <el-table-column prop="name" label="分类名称" width="240" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="200" sortable>
                <template scope="scope">
                    <!--<el-icon name="time"></el-icon>-->
                    <span style="margin-left: 10px">{{ scope.row.createTime | formatDate }}</span>
                </template>
            </el-table-column>
    
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <el-pagination layout="prev,pager,next" :page-size='pageSize' :total="total" @current-change="handleCurrentChange">
            </el-pagination>
        </el-col>
    
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <!--<el-form-item label="id" prop="id">
                    <el-input v-model="editForm.id" disabled auto-complete="off"></el-input>
                </el-form-item>-->
                 <el-form-item label="排序" prop="sort">
                    <!--<el-input v-model="editForm.sort" type="number" placeholder="只能为数字或不填" auto-complete="off"></el-input>-->
                    <el-input-number v-model="editForm.sort" :step="1" :min='1'></el-input-number>
                </el-form-item>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="editForm.name"  placeholder="分类名称长度应在2-10位，推荐3-6个汉字" auto-complete="off"  @keyup.enter.native ='editSubmit'></el-input>
                </el-form-item>
               
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="clean">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading" >提交</el-button>
            </div>
        </el-dialog>
    
        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="排序" prop="sort">
                    <!--<el-input v-model="addForm.sort" type="number" placeholder="只能为数字或不填" auto-complete="off"></el-input>-->
                    <el-input-number v-model="addForm.sort" :step="1" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="addForm.name" placeholder="分类名称长度应在2-10位，推荐3-6个汉字" auto-complete="off" @keyup.enter.native ='addSubmit'></el-input>
                </el-form-item>
    
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="clean">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    
    </el-col>
</template>

<script>
// import util from '@/assets/comon'
import { classList, removeClass, editClass, addClass } from '@/service/getData'
export default {
    data() {
          var nospace = (rule,value,callback) => {
            var par = /^[a-zA-Z\u4E00-\u9FA5\_]{2,10}$/
            if(!par.test(value) &&　value.trim()!=''){
                 callback(new Error('分类名称为中英文,下划线，长度2~10位'));
                //this.$refs.addForm.name = this.$refs.addForm.name.subString(1)
                
            }else if(value.trim()==''){
                callback(new Error('分类名称不能为空'))
            }else{
                callback()
            }
            
            
        }
        return {
            msg: '',
            listLoading: false,
            total: 0,
            lists: [],
            sels: [],//列表选中列
            pageSize: 20,
            page: 1,

            editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            editFormRules: {
                    name: [
                     { required: true, message: '分类名称不可为空', trigger: 'blur' },
                     { validator: nospace, trigger: 'blur' } 
                    ]
            },
            //编辑界面数据
            editForm: {
                id: 0,
                name: '',
                sort: ''



            },

            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            addFormRules: {
                name: [
                     { required: true, message: '分类名称不可为空', trigger: 'blur' },
                      { validator: nospace, trigger: 'blur' } 
                    //  { min: 2, max: 10, message: '分类名称长度应在 2 到 10 个字符之间', trigger: 'blur' }
                ]

            },
            //新增界面数据
            addForm: {
                sort: '',
                name: ''

            }

        }
    },
    computed: {},
    components: {},
    async mounted() {
        this.getClass()
    },
    methods: {
        clean(){
           if(this.editFormVisible == true){
                 this.editFormVisible = false
                this.$refs['editForm'].resetFields()
           }else if(this.addFormVisible == true){
                this.addFormVisible = false
                this.$refs['addForm'].resetFields()
           }
           
       },
        //性别显示转换
        formatSex: function (row, column) {
            return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
        },
        getClass(data) {

            let pageData = {
                page: this.page - 1,
                pageSize: this.pageSize
            }

            this.listLoading = true
            classList(pageData).then((res) => {

                if (res.data.state == 'success') {
                    this.total = res.data.newsCalss.totalElements
                    this.lists = res.data.newsCalss.content
                    
                }else{
                    this.total =0
                    this.lists = []
                }
                this.listLoading = false

            })
        },
        async handleCurrentChange(val) {
            this.page = val
            this.getClass()
        },
        async handleSizeChange(val) {
            this.pageSize = val
            this.getClass()
        },
        async handleDel(index, row) {

            this.$confirm('确认删除该记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoding = true;
                let para = { id: row.id }
                removeClass(para).then((res) => {
                    this.listLoding = false;
                    if (res.data.state == 'success') {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getClass();
                    } else if (res.data == '') {
                        this.$message('登录超时，请重新登录')
                        this.$router.push({
                            path: '/login',
                            query: { redirect: this.$route.path }
                        })
                    }else{
                        this.$message('系统出错')
                    }

                }).catch((res) => {
                    console.log(res.data)
                })
            })

        },
        selsChange(sels) {
            this.sels = sels;
            console.log(sels)
        },
        batchRemove() {
            let ids = this.sels.map(item => item.num).toString()
            console.log(ids)
            this.$confirm('确认删除该记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoding = true;
                let para = { ids: ids }
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
            this.editFormVisible = true
            this.editForm = Object.assign({}, row)

            console.log(this.editForm)
        },
        handleAdd: function () {
            let len = this.lists.length+1
            this.addFormVisible = true;
            this.addForm = {
                name: '',
                sort: len
            }
        },
        // 编辑之后保存至数据库
        editSubmit() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认要保存修改吗？', '提示', {}).then(() => {
                        this.editLoding = true;
                        let para = {
                            id: this.editForm.id,
                            name: this.editForm.name,
                            sort: this.editForm.sort
                        }
                        editClass(para).then((res) => {
                             console.log(res)
                            this.editLoading = false
                            if (res.data.state == 'success') {
                                this.$message({
                                    message: "保存成功",
                                    type: 'success'
                                })
                                this.$refs['editForm'].resetFields()
                                this.editFormVisible = false;
                                this.getClass()
                            } else if (res.data == '') {
                                this.$message('登录超时，请重新登录')
                                this.$router.push({
                                    path: '/login',
                                    query: { redirect: this.$route.path }
                                })
                            }

                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消输入'
                        });       
                    })
                }
            })
        },
        //新增
        addSubmit: function () {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确定添加该分类吗？', '提示', {}).then(() => {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.addForm);
                        console.log(para)
                        addClass(para).then((res) => {
                            this.addLoading = false;
                            //NProgress.done();
                            if (res.data.state == 'success') {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getClass();
                            } else if (res.data == '') {
                                this.$message('登录超时，请重新登录')
                                this.$router.push({
                                    path: '/login',
                                    query: { redirect: this.$route.path }
                                })
                            }
                        });
                    });
                }
            });
        },




    }
}
</script>

<style>
.toolbar {
    padding: 10px 20px;
}

.toolbar .el-pagination {
    float: right;
}
</style>
