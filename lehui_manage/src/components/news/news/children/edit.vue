<template>
  <el-col :span="24">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" class="addNews">
				
				
                <el-form-item label="展示图片" prop="imgs[0].path">
					<el-upload
                            class="avatar-uploader"
                            ref="upload"
                            :action="uploadImg"
                            type="drag"
                            :show-file-list="false"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            list-type="picture-card"
                            >
                        <img v-if="editForm.imgs[0].path" :src="editForm.imgs[0].path" class="avatar">
                        <i class="el-icon-upload avatar-uploader-icon"></i>
                        <div class="el-upload__tip" slot="tip">
                            请上传正确的图片格式，且不超过500kb
                        </div>
                    </el-upload>
				</el-form-item>
                <el-form-item label="选择分类" prop="classId">
                    <el-select v-model="editForm.classId" clearable placeholder="请选择新闻分类">
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                     </el-select>
                </el-form-item>
                <el-form-item label="新闻标题" prop="title">
					<el-input v-model="editForm.title" auto-complete="off" ></el-input>
				</el-form-item>
                <el-form-item label="新闻内容" prop="content">
                    <vue-html5-editor :content="editForm.content" :height="300" :show-module-name="showModuleName"
                        @change="updateData" ref="editor"></vue-html5-editor>
                </el-form-item>	
			</el-form>
				 
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading" style="width:200px;margin-left:360px">提交</el-button>
			 
  </el-col>
</template>

<script>
import { classList,editNews,newsList,testlink } from '@/service/getData'
export default {
    data() {
        return {
            uploadImg:process.env.BASE_URL+'/upload',
            options:[],
            showModuleName:false,
            editLoading: false,
            editFormRules: {
                title: [
                    { required: true, message: '新闻标题不能为空', trigger: 'blur' }
                ],
                content:[
                    { required: true, message: '新闻内容不能为空', trigger: 'blur' }
                ],
                classId:[
                    { required: true, message: '请选择新闻所属分类', trigger: 'blur' }
                ]
            },
            //新增界面数据
            editForm: {
                id:this.$route.query.id,
                title:'',
                classId:'',
                imgs: [{
                    path:''
                }],
                content:''
            },
             start:false

        }

        
    },
    mounted(){
        
        this.getClass()
        this.getNews()
        
    },
    methods:{
         getClass(){
             
            classList().then((res) => {
               if(res.data.state == 'success'){
                this.options = res.data.newsCalss.content
                // console.log(this.options)
               }
               
            })
        },
        getNews(){
            let para = {id:this.$route.query.id}
            newsList(para).then((res) => {
               if(res.data.state == 'success'){
                this.editForm.classId = res.data.news.newsClass.id
                this.editForm.content = res.data.news.content
                this.editForm.title = res.data.news.title
                this.editForm.imgs[0].path = res.data.news.img[0].path 
                //console.log(res.data.news)
               }
               
            })
        },
        handleSuccess(value){
             if(value[0] == null){
               this.$message('图片格式不正确')
               return false
            }
            this.editForm.imgs[0].path = value[0]
            console.log(value)

        },
        handleRemove(value){
            console.log(value)
        },
        handleError(){
            this.$notify.error({
              title: '上传失败',
              message: '图片上传接口上传失败，可更改为自己的服务器接口'
          });
        },
        async editSubmit(){
           this.$refs.editForm.validate((valid) => {
                if(valid) {
                    let para = Object.assign({}, this.editForm);
                    para.imgs = JSON.stringify(para.imgs)
                    this.$confirm('确认修改吗？','提示',{
                        type:'warning'
                    }).then(() => {
                         editNews(para).then((res) => {
                             console.log(res)
                             if(res.data.state == 'success'){
                                this.$message('修改成功')
                                this.$router.push('/index/news/list')
                             }else if(res.data == ''){
                                this.$message('登录超时，请重新登录')
                                this.$router.push({
                                        path:'/login',
                                        query:{redirect:this.$route.path+'?id='+this.$route.query.id}
                                    })
                             }
                           
                        })
                    })
                   
                   
                }
          })
        },
        updateData(data){
            this.editForm.content = data
            if(this.start == false){
                this.start = true
                this.startTime = new Date()
                this.setInter()
            }
            
        },
        setInter(){
            console.log(this.startTime)
            
            if(this.start == true){
                let start = this.startTime.getTime()
                let end = new Date().getTime()
                let intervel = window.setTimeout(() => {
                        testlink()
                        this.start = false
                },3000)
            }
        }
    }

}
</script>

<style>


.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
