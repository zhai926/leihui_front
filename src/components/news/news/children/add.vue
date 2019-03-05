<template>
    <el-col :span="24">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" class="addNews">
    
            <el-form-item label="展示图片" prop="imgs[0].path">
                <el-upload class="avatar-uploader" ref="upload" :action="uploadImg" type="drag" :show-file-list="false" :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" list-type="picture-card">
                    <img v-if="addForm.imgs[0].path" :src="addForm.imgs[0].path" class="avatar">
                    <i class="el-icon-upload avatar-uploader-icon"></i>
                    <div class="el-upload__tip" slot="tip">
                        请上传正确的图片格式，且不超过500kb
                        <p style="color:orange">Tip: 上传图片用于首页展示，尺寸最好为：290px × 260px (小图) 或 590px × 260px (大图) 或 相近比例的图片</p>
                    </div>
    
                </el-upload>
            </el-form-item>
            <el-form-item label="选择分类" prop="classId">
                <el-select v-model="addForm.classId" clearable placeholder="请选择新闻分类">
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="新闻标题" prop="title">
                <el-input v-model="addForm.title" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新闻内容" prop="content">
                <vue-html5-editor :content="addForm.content" :auto-height="false" :height="500" :show-module-name="showModuleName" @change="updateData" ref="editor"></vue-html5-editor>
            </el-form-item>
        </el-form>
    
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading" style="width:200px;margin-left:360px">提交</el-button>
    
    </el-col>
</template>

<script>
import { classList, addNews, testlink } from '@/service/getData'
export default {
    data() {
        var nospace = (rule, value, callback) => {
            if (value.trim() == '') {
                callback(new Error('不能全部为空格'));

            } else {
                callback()
            }
        };
        return {
            uploadImg: process.env.BASE_URL + '/upload',
            options: [],
            showModuleName: false,
            addLoading: false,
            addFormRules: {
                title: [
                    { required: true, message: '新闻标题不能为空', trigger: 'blur' },
                    { validator: nospace, trigger: 'blur' }
                    // { pattern:/^(\w){4,6}$/,message:'asdfas撒旦法'}
                ],
                content: [
                    { required: true, message: '新闻内容不能为空', trigger: 'blur' }
                ],
                classId: [
                    { required: true, message: '请选择新闻所属分类', trigger: 'blur' }
                ]
            },
            //新增界面数据
            addForm: {
                title: '',
                classId: '',
                imgs: [{
                    path: ''
                }],
                content: ''
            },
            start: false
        }

    },
    mounted() {
        this.getClass()
    },
    methods: {
        getClass() {
            classList().then((res) => {
                if (res.data.state == 'success') {

                    this.options = res.data.newsCalss.content
                    this.addForm.classId = this.options[0].id

                    // console.log(this.options)
                } else {
                    this.options = []

                }
                if (this.options.length < 1) {
                    this.$message('请先添加新闻分类')
                    this.$router.push('/index/newsClass')
                }

            })
        },
        handleSuccess(value) {
            if (value[0] == null) {
                this.$message('图片格式不正确')
                return false
            }
            this.addForm.imgs[0].path = value[0]
            console.log(value)

        },
        handleRemove(value) {
            console.log(value)
        },
        handleError() {
            this.$notify.error({
                title: '上传失败',
                message: '图片上传接口上传失败,或者图片格式不正确'
            });
        },
        async addSubmit() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    let para = Object.assign({}, this.addForm);
                    para.imgs = JSON.stringify(para.imgs)
                    // console.log(para)
                    para.title = para.title.trim()
                    addNews(para).then((res) => {
                        //  console.log(res)
                        if (res.data.state == 'success') {
                            this.$message('添加成功')
                            this.$refs['addForm'].resetFields()
                            this.$router.push('/index/news/list')
                        } else if (res.data == '') {
                            this.$message('登录超时，请重新登录')
                            this.$router.push({
                                path: '/login',
                                query: { redirect: this.$route.path }
                            })
                        } else {
                            this.$message('添加失败')
                        }

                    })

                }
            })
        },
        updateData(data) {

            if (this.start == false) {
                this.start = true
                this.startTime = new Date()
                this.setInter()
            }
            this.addForm.content = data
        },
        setInter() {
            console.log(this.startTime)

            if (this.start == true) {

                let intervel = window.setTimeout(() => {
                    testlink()
                    this.start = false
                }, 300000)
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

.addNews .el-form-item__content {
    width: 820px;
}
</style>
