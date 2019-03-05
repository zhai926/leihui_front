<template>
  <el-col :span="24"> 
    <!--查询工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!--<el-form-item>
					<el-input v-model="filters.name" placeholder="用户名"></el-input>
				</el-form-item>-->
				<el-form-item>
					<!--<el-button type="primary" v-on:click="getUsers('page')">查询</el-button>-->
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
        <el-table :data="lists" highlight-current-row border stripe v-loading="listLoading"  @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="sort" label="排序" min-width="70"  sortable>
            </el-table-column>
           <el-table-column prop="onlyShow" label="是否一直显示" width="150" >
              <template scope= "scope">
                {{scope.row.onlyShow?'是':'否'}}
              </template>
            </el-table-column>
             <el-table-column type="expand" prop="path" label="图片展示" width="100"  sortable>
               <template scope="scope">
                   <img :src="scope.row.path" />
               </template>
            </el-table-column>
             <el-table-column prop="title" label="图片标题" min-width="200"  sortable>
            </el-table-column>
            
            <el-table-column prop="url" label="链接地址" width="240" >
            </el-table-column>
            <el-table-column prop="startDate" label="开始时间" width="140" sortable>
                 <template scope="scope">
                    <!--<el-icon name="time"></el-icon>-->
                    <span style="margin-left: 10px">{{ scope.row.startDate | formatDate }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="endDate" label="结束时间" width="140" sortable>
                <template scope="scope">
                    <!--<el-icon name="time"></el-icon>-->
                    <span style="margin-left: 10px">{{ scope.row.endDate | formatDate }}</span>
                </template>
            </el-table-column>
           
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
         <!--编辑界面  -->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="广告标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="链接地址" prop="url">
					<el-input v-model="editForm.url" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="上传图片" prop="path" class="addPicBox">
                    <el-upload
                                ref="upload"
                                :action="uploadImg"
                                type="drag"
                                :show-file-list="false"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                list-type="picture-card"
                                >
                            <img v-if="editForm.path" :src="editForm.path" class="avatar">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__tip" slot="tip">
                                为避免失真，上传的图片应该是1200px*350px或者比例相近的图片
                            </div>
                        </el-upload>
				</el-form-item>
                 <el-form-item label="永久显示" prop="onlyShow" >
                        <el-switch
                            v-model="editForm.onlyShow"
                            on-text="on"
                            off-text="off">
                        </el-switch>
                </el-form-item>
				<el-form-item label="开始时间" prop="startDate"  v-if="!editForm.onlyShow">
					<el-date-picker
                        v-model="editForm.startDate"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
				</el-form-item>
                 <el-form-item label="结束时间" prop="endDate" v-if="!editForm.onlyShow">
					<el-date-picker
                        v-model="editForm.endDate"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
				</el-form-item>
                
                 <el-form-item label="排序" prop="sort" >
                        <el-input-number v-model="editForm.sort" :step="1" :min="1"></el-input-number> 
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="clean">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

         <!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="广告标题" prop="title">
					<el-input v-model="addForm.title" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="链接地址" prop="url">
					<el-input v-model="addForm.url" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="上传图片" prop="path" class="addPicBox">
					<el-upload
                            ref="upload"
                            :action="uploadImg"
                            type="drag"
                            :show-file-list="false"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            list-type="picture-card"
                            >
                        <img v-if="addForm.path" :src="addForm.path" class="avatar">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__tip" slot="tip">
                            为避免失真，上传的图片应该是1200px*350px或者比例相近的图片
                        </div>
                    </el-upload>
				</el-form-item>
                <el-form-item label="永久显示" prop="onlyShow" >
                        <el-switch
                            v-model="addForm.onlyShow"
                            on-text="on"
                            off-text="off">
                        </el-switch>
                </el-form-item>
				<el-form-item label="开始时间" prop="startDate" v-if="!addForm.onlyShow">
					<el-date-picker
                        v-model="addForm.startDate"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
				</el-form-item>
                <el-form-item label="结束时间" prop="endDate" v-if="!addForm.onlyShow">
					<el-date-picker
                        v-model="addForm.endDate"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions0">
                      </el-date-picker>
				</el-form-item>
                 <el-form-item label="排序" prop="sort" >
                        <el-input-number v-model="addForm.sort" :step="1" :min="1"></el-input-number> 
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="clean">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
    
</el-col>
</template>

<script>

import { brandList,removeBrand,addBrand,editBrand } from '@/service/getData'
import VueCoreImageUpload  from 'vue-core-image-upload'
export default {
  data() {
     var validateaddDate = (rule, value, callback) => {
        if(this.addForm.onlyShow == false){
            if(value === ''){
                callback(new Error('请选择开始时间'))
            }else {
                this.$refs.addForm.validateField('endDate');
            }
            callback()
        } else {
          callback()
        }
      }; 
      var compareaddDate = (rule,value,callback) => {
          if(this.addForm.onlyShow == false){
            if(value === ''){
                callback(new Error('请选择结束时间'))
            }
            else if(this.addForm.startDate !=='' && this.addForm.startDate.getTime() > value.getTime()-1){
                    callback(new Error('结束时间应该大于开始时间'))
                 
            }
            else if(this.addForm.startDate === ''){
                     this.$refs.addForm.validateField('startDate');
            }else{
                 callback()
            }
           
         }else {
          callback()
        }
      };
       var validateeditDate = (rule, value, callback) => {
            if(this.editForm.onlyShow == false){
                    if(typeof value !== 'object'){
                        callback(new Error('请选择开始时间'))
                    }else  {
                        this.$refs.editForm.validateField('endDate');
                    }
                    callback()
                } else {
                    callback()
                }
      }; 
      var compareeditDate = (rule,value,callback) => {
          
           if(this.editForm.onlyShow == false){
                if(typeof value !== 'object'){
                    callback(new Error('请选择结束时间'))
                }else if( typeof value === 'object' && typeof  this.editForm.startDate ==='object'){
                    if(this.editForm.startDate.getTime() > this.editForm.endDate.getTime()-1){
                         callback(new Error('结束时间应该大于开始时间'))
                    }
                    callback()    
                }else if(this.editForm.startDate === ''){
                        this.$refs.editForm.validateField('startDate');
                }
                 callback()
         }else {
          callback()
        }
             
      }
    return {
        filters:{

        },
        uploadImg:process.env.BASE_URL+'/upload',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        value1:'',
        value2:'',
        src:require('@/assets/logo.png'),
        fileList: [],
        lists:[],
        listLoading : false,
        total:0,
        pageSize: 1,
        page: 1,

         editFormVisible: false,//编辑界面是否显示
            editLoading: false,
            editFormRules: {
              path: [
                { required: true, message: 'banner图不能为空', trigger: 'blur' }
              ],
              startDate: [
                   {validator:validateeditDate, trigger: 'change' }
                ],
                endDate: [
                   {validator:compareeditDate, trigger: 'change' }
                ]
            },
            //编辑界面数据
            editForm: {
                title: '',
                url: '',
                path:'',
                onlyShow: '',
                startDate:'',
                endDate:'',
                sort:''
                
            },

            addFormVisible: false,//新增界面是否显示
            addLoading: false,
            addFormRules: {
                path: [
                    { required: true, message: 'banner图不能为空', trigger: '' }
                ],
                startDate: [
                   {validator:validateaddDate, trigger: 'change' }
                ],
                endDate: [
                   {validator:compareaddDate, trigger: 'change' }
                ]
            },
            //新增界面数据
            addForm: {
                title: '',
                url: '',
                path:'',
                onlyShow: '',
                startDate:'',
                endDate:'',
                sort:''
                
            }

    }
  },
  mounted(){
    
      this.getLists()
  },

  components:{ VueCoreImageUpload },
  methods:{
       clean(){
           if(this.editFormVisible == true){
                 this.editFormVisible = false
                this.$refs['editForm'].resetFields()
           }else if(this.addFormVisible == true){
                this.addFormVisible = false
                this.$refs['addForm'].resetFields()
           }
           
       },
        getLists() {
           this.listLoading=true
          brandList().then((res) => {
               this.listLoading=false
               
            //    console.log(res.data)
               if(res.data.state == 'success'){
                    this.lists=[]
                    this.lists =res.data.brands
                    this.total = res.data.brands.length
                    console.log(this.lists)
               }else if(res.data == ''){
                   this.$message('登录超时，请重新登录')
                   this.$router.push({
                        path:'/login',
                        query:{redirect:this.$route.path}
                    })
               }
                
               
        })
       },
       async handleCurrentChange(val) {
            this.page = val
            this.getLists()
        },
        imageuploaded(res) {
          console.log(res)
          
        },
        selsChange(sels) {
            this.sels = sels;
            console.log(sels)
        },
        async handleDel (index,row) {
        
        this.$confirm('确认删除该记录吗？','提示',{
            type:'warning'
        }).then(() => {
            this.listLoding = true;
            let para = {id : row.id}
            removeBrand(para).then((res) => {
                 this.listLoding = false;
                 this.$message({
                     message:'删除成功',
                     type:'success'
                 })
                 this.getLists();
            })
        })
             
      },
       // 弹框的显示隐藏
        handleEdit(index, row) {
            this.editFormVisible = true
            this.editForm = Object.assign({},row)
            this.editForm.startDate = new Date(this.editForm.startDate)
            this.editForm.endDate = new Date(this.editForm.endDate)
        },
        handleAdd: function () {
				this.addFormVisible = true;
                let length = this.lists.length+1
				this.addForm = {
                    title: '',
                    url: '',
                    path:'',
                    onlyShow: true,
                    startDate:'',
                    endDate:'',
                    sort:length
				};
			},
      addSubmit(){
       this.$refs.addForm.validate((valid) => {
                if(valid) {
                    let para = Object.assign({}, this.addForm);
                    console.log(para)
                    if(para.startDate !=''){
                        para.startDate = para.startDate.getTime();
                    }
                    if(para.endDate != ''){
                        para.endDate = para.endDate.getTime();
                    }
                    addBrand(para).then((res) => {
                        this.addFormVisible = false
                        if(res.data.state == 'success'){
                             this.$message('添加成功')
                             this.getLists()
                        }else if(res.data == ''){
                            this.$message('登录超时，请重新登录')
                            this.$router.push({
                                    path:'/login',
                                    query:{redirect:this.$route.path}
                                })
                        }
                       
                        
                        
                    })
                }
          })
      },
      editSubmit(){
          this.$refs.editForm.validate((valid) => {
                if(valid) {
                    let para = Object.assign({}, this.editForm);
                    if(  typeof para.startDate == 'object'  ){
                         para.startDate = para.startDate.getTime();
                    }
                    if(  typeof para.endDate == 'object'){
                         para.endDate = para.endDate.getTime();
                    }
                    // para.endDate = para.endDate.getTime();
                    console.log( para)
                    
                  editBrand(para).then((res) => {
                      if(res.data.state == 'success'){
                          console.log(res.data)
                          this.$message('编辑成功')
                            this.getLists()
                      }else if(res.data == ''){
                            this.$message('登录超时，请重新登录')
                            this.$router.push({
                                    path:'/login',
                                    query:{redirect:this.$route.path}
                                })
                        }
                        
                  })
                    this.editFormVisible = false
                }
          })
      },
      handleRemove(file, fileList) {
          console.log(file, fileList);
      },
      handlePreview(file) {
          console.log(file);
      },
       handleError(){
          this.$notify.error({
              title: '上传失败',
              message: '图片上传接口上传失败'
          });
      },
      handleSuccess(res){
         if(res[0] == null){
             this.$message('图片格式不正确')
         }
        if(this.editFormVisible == true){
            this.editForm.path = res[0]
            // console.log(res)
        }else if(this.addFormVisible == true){
            this.addForm.path = res[0]
            // console.log(res)
        }
       
      }
        
  }
}
</script>

<style>
.pure-button-primary{
  padding:6px 30px;
  border-radius: 4px;
  display: inline-block;
  background-color: blue;
  color:white
}
.addPicBox .el-upload--picture-card{
    width:240px;
    height: 70px;
    line-height: 75px;
    overflow: hidden;
}
.addPicBox .el-upload--picture-card img{
    width:240px;
    height:70px;
}

</style>
