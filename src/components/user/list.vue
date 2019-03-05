<template>
    <el-col :span="24">
        <!--查询工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="用户名" @keyup.enter.native="getUsers('page')"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers('page')">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        <el-table :data="lists" highlight-current-row border stripe v-loading="listLoading"  @selection-change="selsChange" style="width: 100%;">
            <!--<el-table-column type="selection" width="55">
            </el-table-column>-->
            <el-table-column prop="id" label="id" width="240" sortable>
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="240" sortable>
            </el-table-column>
            <el-table-column prop="name" label="昵称" width="240" sortable>
            </el-table-column>
            <el-table-column prop="loginTime" label="上次登录时间" min-width="200"  sortable>
                <template scope="scope">
                    {{scope.row.loginTime | formatDate  }}
                </template>
            </el-table-column>
           
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)"  :disabled="scope.row.username=='admin'">删除</el-button>
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
					<el-input v-model="editForm.id" disabled auto-complete="off" ></el-input>
				</el-form-item>-->
				<el-form-item label="昵称" prop="name">
					<el-input v-model="editForm.name" placeholder="可不填，昵称长度应在3-10位之间" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="密码" prop="password">
					<el-input v-model="editForm.password" type="password" placeholder="可不填，或以字母开头的6-18位字符，只能包含数字，字母，下划线" auto-complete="off"></el-input>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="clean">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

         <!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" >
                <el-form-item label="昵称" prop="name">
					<el-input v-model="addForm.name" placeholder="可不填，所填需满足中英文，长度6~18位" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="username">
					<el-input v-model="addForm.username" placeholder="用户名需满足中英文，长度6~18位" auto-complete="off" ></el-input>
				</el-form-item>
                <el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password" placeholder="请以字母开头的6-18位字符，只能包含数字，字母，下划线" type="password" auto-complete="off"></el-input>
				</el-form-item>
                 <el-form-item label="确认密码" prop="checkPass" >
					<el-input v-model="addForm.checkPass" type="password" placeholder='请确认密码' auto-complete="off"></el-input>
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
import { getUser,removeUser,editUser,addUser } from '@/service/getData'
export default {
    data() {
        var validateUser = (rule,value,callback) => {
            var par = /^[a-zA-Z\u4E00-\u9FA5]{6,18}$/
            if(!par.test(value.trim()) &&　value!=''){
                 callback(new Error('所填需满足中英文，长度6~18位'));
                //this.$refs.addForm.name = this.$refs.addForm.name.subString(1)
                
            }else{
                callback()
            }
        };
    var nospace = (rule, value, callback) => {
        if(value == ''){
            callback()
        }else if(value.trim() == ''){
                callback(new Error('昵称不能全部为空格'));
                
            }else{
                callback()
            }
    };
     var validatePass = (rule, value, callback) => {
         var pareent = /^[a-zA-Z]\w{5,17}$/
        // if (value === '') {
        //   callback(new Error('请输入密码'));
        // } else 
        if(!pareent.test(value) && value !=='' ){
            callback(new Error('密码需已字母开头，长度在6~18之间，只能包含字符、数字和下划线'));
         
        }else {
        //      if (this.addForm.checkPass !== '') {
        //     this.$refs.addForm.validateField('checkPass');
        //   }
          callback()
        }
      };
      var validatePass2 = (rule, value, callback) => {
        // if (value === '') {
        //   callback(new Error('请再次输入密码'));
        // } else
         if (value !== this.addForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
        return {
            filters: {
                name: ''
            },
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
                        { min: 3, max: 10, message: '昵称长度在 3 到 10 个字符', trigger: 'blur' },
                        { validator: nospace, trigger: 'blur' } 
                    ],
					password:[ 
                        { validator: validatePass, trigger: 'blur' } 
                    ]
            },
            //编辑界面数据
            editForm: {
                id: 0,
                username:'',
                name: '',
                password: ''
                
            },

            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            addFormRules: {
                name:[
                    { required: false, trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符,或者暂时不设置', trigger: 'blur' },
                     { validator: nospace, trigger: 'blur' } 
                    
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    // { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    { validator: validateUser, trigger: 'blur' } 
                ],
                password:[ 
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' } 
                ],
                 checkPass: [
                    { required: true, message: '请确认密码', trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' }
                ],
            },
            //新增界面数据
            addForm: {
                username: '',
                name: '',
                password: '',
                checkPass:''
            }

        }
    },
    computed: {},
    components:{ },
    async mounted() {
           
        this.getUsers()
    },
    methods: {
        myMethod(ev){
            
            // if(ev.keyCode == '13'){
                 
            // }
        },
       clean(){
           if(this.editFormVisible == true){
                 this.editFormVisible = false
                this.$refs['editForm'].resetFields()
           }else if(this.addFormVisible == true){
                this.addFormVisible = false
                this.$refs['addForm'].resetFields()
           }
           
       },
        getUsers(data) {
            let _this = this
            if(data == 'page'){
                this.page=1;
            }
            
            let pageData = {
                username:this.filters.name,
                page: this.page-1,
                pageSize:this.pageSize
            }
            this.listLoading = true
            getUser(pageData).then((res) => {
           
               if(res.data.state == 'success'){
                this.total = res.data.members.totalElements
                this.lists = res.data.members.content
               
               }else if(res.data == ''){
                   this.$message('登录超时，请重新登录')
                   this.$router.push({
                        path:'/login',
                        query:{redirect:this.$route.path}
                    })
               }else if(res.data.state == 'error'){
                   if(_this.filters.name != ''){
                         this.$message('搜索不到相关信息')
                        _this.filters.name=""
                   }
                   
               }
                this.listLoading = false
               
            }).catch((res) => {
                this.$message('请求出错，请稍后访问')
            })
        },
        async handleCurrentChange(val) {
            this.page = val
            this.getUsers()
        },
        async handleSizeChange(val) {
            this.pageSize = val
            this.getUsers()
        },
        async handleDel (index,row) {
        //   if( lvl<2 ){
        //     alert('您的级别不够不能删除数据')
        //     return false
        //   }
        if(row.username == 'admin'){
            this.$message('admin不可以删除')
            return false

        }
        this.$confirm('确认删除该记录吗？','提示',{
            type:'warning'
        }).then(() => {
            this.listLoding = true;
            let para = {id : row.id}
            removeUser(para).then((res) => {
                 this.listLoding = false;
                 if(res.data.state == 'success'){
                        this.$message({
                            message:'删除成功',
                            type:'success'
                        })
                        this.getUsers();
                 }else if(res.data.state == 'error'){
                     this.$message({
                            message:'删除失败',
                            type:'warning'
                        })
                 }else{
                     this.$message('登录超时，请重新登录')
                    this.$router.push({
                            path:'/login',
                            query:{redirect:this.$route.path}
                        })
                 }
                 
            })
        })
             
        },
        selsChange(sels) {
            this.sels = sels 
            
        },
        batchRemove(){
            let ids = this.sels.map(item => item.num).toString()
            
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
            this.editFormVisible = true
            this.editForm = Object.assign({},row)
        },
        handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    username: '',
                    name: '',
                    password: '',
                    checkPass:''
				};
			},
        // 编辑之后保存至数据库
        editSubmit(){
            this.$refs.editForm.validate((valid) => {
                if(valid) {
                    this.$confirm('确认要保存修改吗？','提示',{}).then(() => {
                        this.editLoding = true;
                        let para = {
                                id:this.editForm.id,
                                name:this.editForm.name,
                                password:this.editForm.password
                            }
                        console.log(para)
                        
                        editUser(para).then((res) => {
                            this.editLoading = false
                            if(res.data.state=='success'){
                            this.$message({
                                message:"保存成功",
                                type:'success'
                            })
                            this.$refs['editForm'].resetFields()
                            this.editFormVisible = false;
                            this.getUsers()
                            }else　if(res.data==''){
                                this.$message('登录超时，请重新登录')
                                this.$router.push({
                                        path:'/login',
                                        query:{redirect:this.$route.path}
                                    })
                            }
                        })
                    }).catch(() => {
                               
                    });
                }
            })
        },
        //新增
        addSubmit: function () {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.addForm);
                       console.log(para)
                        addUser(para).then((res) => {
                            console.log(res)
                            this.addLoading = false;
                            if(res.data.state == 'success'){
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getUsers();
                            }else　if(res.data==''){
                                this.$message('登录超时，请重新登录')
                                this.$router.push({
                                        path:'/login',
                                        query:{redirect:this.$route.path}
                                    })
                            }else{
                                this.$message('添加失败')
                            }
                        });
                    }).catch(() => {
                               
                    });
                }
            });
        },


        
        
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
