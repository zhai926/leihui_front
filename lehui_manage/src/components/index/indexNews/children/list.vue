<template>
  <el-col :span="24">
    <!--查询工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <!--<el-form-item>
  					<el-input v-model="filters.name" placeholder="用户名"></el-input>
  				</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-button type="primary" v-on:click="getUsers('page')">查询</el-button>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增一行</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  
    <el-table :data="lists" highlight-current-row border stripe v-loading="listLoading"  @selection-change="selsChange" style="width: 100%;">
      
      <el-table-column type="expand" width="200">
        <template scope="scope">
          <el-table :data="scope.row.floorNewsList" highlight-current-row border stripe  @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="id" label="id" width="200" sortable>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="280">
            </el-table-column>
            <el-table-column type="expand" prop="path" label="图片" min-width="200" >
              <template scope="scope">
                <img :src="scope.row.path" ></img>
              </template>
            </el-table-column>
            <el-table-column prop="bigPic" label="是否展示大图" width="400">
              <template scope="scope">
                <span>{{scope.row.bigPic==true?'是':'否'}}（注意：选择的新闻必须有上传展示图片）</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="sort"  label="排序" width="120" sortable >
      </el-table-column>
      <el-table-column prop="showFormat" label="样式" width="160" sortable>
        <template scope="scope">
          <img :src="one" class='styleImg'  v-if="scope.row.showFormat == '22'"></img>
           <img :src="two"  class='styleImg'  v-if="scope.row.showFormat == '112'"></img>
            <img :src="three" class='styleImg' v-if="scope.row.showFormat == '121'"></img>
             <img :src="four" class='styleImg'  v-if="scope.row.showFormat == '211'"></img>
              <img :src="five" class='styleImg' v-if="scope.row.showFormat == '1111'"></img>
        </template>
      </el-table-column>
  
      <el-table-column prop="createTime" label="创建时间" min-width="150" sortable>
        <template scope="scope">
          <span>{{scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="选择新闻" prop="newsId">
          <!--<trans-module @select="select"></trans-module>-->
        <ul class="select_list">
          <li v-for="(val,index) in value3" >
            是否显示大图
            <el-switch  v-model="val.bigPic"　on-text="" @change="onleOne(val.id)"　off-text="">
            </el-switch>
            <span class="title"> {{val.title}}</span><i class="el-icon-close" @click="delSel(index)"></i>
          </li>
        </ul>
        <el-button @click="moveNews">添加新闻</el-button>
        <span style="color:orange"> ( Tip:请选择有展示图片的新闻作为首页新闻 ) </span>
        </el-form-item>
        <el-form-item label="选择样式" prop="bigPic">
          <el-radio-group v-model="addForm.styles">
            <el-radio label="22" :disabled="value3.length!=2">两张大图</el-radio>
            <el-radio label="112" :disabled="value3.length!=3">大图居右</el-radio>
            <el-radio label="121" :disabled="value3.length!=3">大图居中</el-radio>
            <el-radio label="211" :disabled="value3.length!=3">大图居左</el-radio>
            <el-radio label="1111" :disabled="value3.length!=4">四张小图</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="选择行数" prop="sort">
          <el-input-number v-model="addForm.sort" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="clean">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  
  <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="选择新闻" prop="newsId">
          <!--<trans-module @select="select"></trans-module>-->
          <ul class="select_list">
          <li v-for="(val,index) in value3" >
            是否显示大图
            <el-switch  v-model="val.bigPic"　on-text="" @change="onleOne(val.id)"　off-text="">
            </el-switch>
            <span class="title"> {{val.title}}</span><i class="el-icon-close" @click="delSel(index)"></i>
          </li>
        </ul>
        <el-button @click="moveNews">添加新闻</el-button><span style="color:orange"> ( Tip:请选择有展示图片的新闻作为首页新闻 ) </span>
        </el-form-item>
        <el-form-item label="选择样式" prop="bigPic">
          <el-radio-group v-model="editForm.styles">
            <el-radio label="22" :disabled="value3.length!=2">两张大图</el-radio>
            <el-radio label="112" :disabled="value3.length!=3">大图居右</el-radio>
            <el-radio label="121" :disabled="value3.length!=3">大图居中</el-radio>
            <el-radio label="211" :disabled="value3.length!=3">大图居左</el-radio>
            <el-radio label="1111" :disabled="value3.length!=4">四张小图</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="选择行数" prop="sort">
          <el-input-number v-model="editForm.sort" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="clean">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新闻列表界面-->
    <el-dialog title="新闻列表" v-model="addNewsVisible" :close-on-click-modal="false">
          <new-list @addNews="addNews" :calSel="calSel" ></new-list>
    </el-dialog>

  </el-col>
</template>

<script>
import newList from './listNews'
import { indexList, removeIndex, addIndex, editIndex, newsList,classList } from '@/service/getData'
import transModule from '../trans.vue'
import one from '@/assets/22.png'
import two from '@/assets/112.png'
import three from '@/assets/121.png'
import four from '@/assets/211.png'
import five from '@/assets/1111.png'
export default {
  data() {
    
    return {
      sortP:{
        order:'descending'
      },
      one:one,
      two:two,
      three:three,
      four:four,
      five:five,
      datas: [],
      filters: {},
      value3: [],
      value1: '',
      value2: '',
      src: require('@/assets/logo.png'),
      fileList: [],
      lists: [],
      listLoading: false,
      total: 1,
      pageSize: 100,
      page: 1,
      options:[],
      editFormVisible: false,//编辑界面是否显示
      editLoading: false,
      editFormRules: {
        path: [
          // { required: true, message: '请输入账户名', trigger: 'blur' }
        ]
      },
      addNewsVisible:false,
      //编辑界面数据
      editForm: {
        styles: '22',
        newsId: [],
        bigPic: [],
        sort: ''

      },
      addFormVisible: false,//新增界面是否显示
      addLoading: false,
      addFormRules: {
        // path: [
        //     { required: true, message: 'banner图不能为空', trigger: 'blur' }
        // ]
      },
      //新增界面数据
      addForm: {
        styles: '22',
        newsId: [],
        bigPic: [],
        sort: ''

      },
      // 已经在展示的新闻集合
      selectList:[],
      calSel:[],
      checkValue:[]

    }
  },
  mounted() {
     
    this.getLists()

  },
  components: { transModule,newList },
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
    getLists() {
      this.listLoading = true
      let _this = this
      indexList().then((res) => {
         this.listLoading = false
         let selectList=[]
        if(res.data.state == 'success'){
          _this.lists = []
          _this.selectList=[]
          console.log(res.data.floorModels)
          _this.lists = res.data.floorModels
          res.data.floorModels.forEach((item) => {
              selectList = selectList.concat(item.floorNewsList)
          })
          selectList.forEach((item) => {
            _this.selectList.push(item.id)
          })
           //this.$store.dispatch('addIndexNew',_this.selectList)
          
          _this.addForm.sort = res.data.floorModels.length+1
        }else if(res.data.state == 'error'){
          _this.lists = []
          console.log(res.data)
        }
      })
      //console.log(this.addForm)
    },
    
    handleDel(index, row) {
      let para = {
        id : row.id
      }
      let _this = this
     this.$confirm('确认删除该记录吗？','提示',{
            type:'warning'
        }).then(() => {
          _this.listLoding = true;
           removeIndex(para).then((res) => {
            if(res.data.state == 'success'){
              this.$message('删除成功')
              this.getLists()
            }else if(res.data == ''){
              this.$message('登录超时，请重新登录')
               _this.$router.push({
                path:'/login',
                query:{redirect:_this.$route.path}
              })
              
            }
          })
        })
      
      console.log(row)
    },
    handleEdit(index,row) {
      let _this=this
      this.editFormVisible = true
      
      this.editForm.sort = row.sort
      this.editForm.id = row.id
      
      this.value3=[]
      this.checkValue = []
      row.floorNewsList.forEach((res) => {
        // _this.editForm.newsId.push(res.id)
        _this.value3.push({
          id:res.id,
          title:res.title,
          bigPic:res.bigPic
        })
        _this.checkValue.push({
           id:res.id,
           title:res.title,
           bigPic:res.bigPic
        })
      })
      this.editForm.styles = row.showFormat.toString()
      console.log(this.editForm.styles)
     
    },
    handleAdd() {
      // this.getNews()
      this.value3=[]
      this.addFormVisible = true;
    },
    selsChange(val) {
      console.log(val)
    },
    newselsChange(val){
      consolelog(val)
    },
    addSubmit() {
            let _this=this
            let ids=[]
            if(this.value3.length<2 ||　this.value3.length>4){
              this.$message('每行的展示新闻最少两个，最多四个')
              return false
            }
            else if(this.value3.length == 4){
              this.addForm.bigPic = [false,false,false,false]
              ids =  this.addForm.newsId
                    _this.value3.forEach((item) => {
                        ids.push(item.id)
                    })
            }
            else if (this.value3.length ==2) {
              this.addForm.bigPic = [true,true]
                  _this.value3.forEach((item) => {
                        ids.push(item.id)
                    })
            }
            else if (this.value3.length == 3){
                ids = this.calculate(this.addForm.styles)
            }
          let para = {
            newsIds : ids.join(','),
            bigPic : _this.addForm.bigPic.join(','),
            sort: _this.addForm.sort,
            format:parseInt(_this.addForm.styles)
          }
          console.log(para)
         addIndex(para).then((res) => {
           console.log(res)
           if(res.data.state=='success'){
             _this.addFormVisible = false
             _this.value3=[]
              _this.getLists()
             _this.$refs['addForm'].resetFields()
             _this.$message('添加成功')
           }else if(res.data == ''){
             _this.$message('登录超时，请重新登录')
              _this.$router.push({
                path:'/login',
                query:{redirect:_this.$route.path}
              })
           }
         })
      
    },
    editSubmit() {
            let _this=this
            let ids=[]
            if(this.value3.length<2 ||　this.value3.length>4){
              this.$message('每行的展示新闻最少两个，最多四个')
              return false
            }
            else if(this.value3.length == 4){
              this.editForm.bigPic = [false,false,false,false]
              // ids =  this.editForm.newsId
                _this.value3.forEach((item) => {
                    ids.push(item.id)
                })
            }
            else if (this.value3.length ==2) {
              this.editForm.bigPic = [true,true]
                  _this.value3.forEach((item) => {
                        ids.push(item.id)
                    })
            }
            else if (this.value3.length == 3){
                ids = this.calculate(this.editForm.styles)
            }
          let para = {
            id:_this.editForm.id,
            newsIds : ids.join(','),
            bigPic : _this.editForm.bigPic.join(','),
            sort: _this.editForm.sort,
            format:parseInt(this.editForm.styles)
          }
          console.log(para)
         editIndex(para).then((res) => {
           console.log(res)
           if(res.data.state=='success'){
             this.editFormVisible = false
             this.value3=[]
             this.getLists()
             this.$refs['editForm'].resetFields()
             this.$message('编辑成功')
           }else if(res.data == ''){
             _this.$message('登录超时，请重新登录')
              _this.$router.push({
                path:'/login',
                query:{redirect:_this.$route.path}
              })
           }
         })
      
    },
    calculate(value){//  新闻按照大图显示与样式进行匹配
      let _this=this
      let ids=[]
         switch (value){
            case '112':
                _this.addForm.bigPic = [false,false,true]
                _this.editForm.bigPic = [false,false,true]
                  _this.value3.forEach((item) => {
                      if(item.bigPic == false){
                        ids.push(item.id)
                      }
                    })
                     _this.value3.forEach((item) => {
                      if(item.bigPic == true){
                        ids.push(item.id)
                      }
                    })
                break;
            case '211':
                _this.editForm.bigPic = [true,false,false]
                 _this.addForm.bigPic = [true,false,false]
                
                  _this.value3.forEach((item) => {
                      if(item.bigPic == true){
                        ids.push(item.id)
                      }
                    })
                    _this.value3.forEach((item) => {
                      if(item.bigPic == false){
                        ids.push(item.id)
                      }
                    })
                break;
            default:
            _this.addForm.bigPic = [false,true,false]
            _this.editForm.bigPic = [false,true,false]
                   _this.value3.forEach((item) => {
                      if(item.bigPic == false){
                        ids.push(item.id)
                      }
                    })
                    _this.value3.forEach((item) => {
                      if(item.bigPic == true){
                        ids.splice(1, 0, item.id); 
                      }
                    })
              break;
          }
          return ids
    },
     
    onleOne(index) {
      if (this.value3.length == 3) {
        this.value3.forEach((item) => {
          if (item.id != index) {
            item.bigPic = false
          }
        })
      }
    },
    addNews(index){
      let _this= this
      
      // this.addForm.newsId = index.split(',')
      if(this.value3.length+index.length>4){
        this.$message('每行最多添加四条新闻')
      }else{
        this.addNewsVisible = false
        index.forEach((item) => {
          _this.value3.push(item)
        })
      }
      console.log(  _this.value3)
      this.getSelect()
    },
    delSel(index){
      console.log(index)
      this.value3.splice(index,1)
      this.getSelect()
      
    },
    getSelect() {
      // 判断默认样式
       let length=0
      //  添加三个新闻的默认
       let _this = this
       console.log(_this.value3)
        _this.value3.forEach((item) => {
          if(item.bigPic==false){
            length += 1
          }
        })
         if(_this.value3.length == 3){
            _this.value3[0].bigPic=true
             _this.value3[1].bigPic=false
              _this.value3[2].bigPic=false

          }
          
          // 单选按钮默认设置
      if (this.value3.length == 2) {
        this.addForm.styles = '22'
         this.editForm.styles = '22'
          _this.value3[0].bigPic=true
          _this.value3[1].bigPic=true
      } else if (this.value3.length == 3) {
        this.addForm.styles = '121'
         this.editForm.styles = '121'
      } else if (this.value3.length == 4) {
         this.addForm.styles = '1111'
          this.editForm.styles = '1111'
          _this.value3.forEach((item) => {
            item.bigPic = false
          })
      }
      // console.log( this.addForm.styles)
      
    },
     moveNews(){
         
      let _this = this
       this.calSel=[]
       console.log(this.calSel)
      // this.calSel = this.selectList
     if(this.selectList.length>0){
       this.selectList.forEach((item) => {
         let sel = ''
         if(_this.checkValue.length > 0){
            _this.checkValue.forEach((child) => {
              if(child.id === item) {
                sel=item
                return 
              }
            })
         }
         
        if(sel === ''){
           
          this.calSel.push(item)
        }
         
       })
     }
     console.log(this.calSel)
     console.log(this.value3)
        if(this.value3.length>0){
          _this.value3.forEach((res) => {
            let id=''
            this.calSel.forEach((item) => {
              if(item === res.id){
                id = item
              }
            })
            if(id === ''){
               this.calSel.push(res.id)
            }
           
          })
        }
        console.log(this.calSel)
         this.$store.dispatch('addIndexNew',_this.calSel)
         this.addNewsVisible=!this.addNewsVisible
     
    },

  }
}
</script>

<style>
.pure-button-primary {
  padding: 6px 30px;
  border-radius: 4px;
  display: inline-block;
  background-color: blue;
  color: white
}
.el-transfer-panel{
    width:437px !important;
}
.styleImg{
  width:120px;
  margin-top:5px;
  opacity:0.5;
  height:25px;
  }
.select_list {
  width: 100%;
  min-height: 36px;
  padding: 2px 10px;
  border: 1px solid #bfcbd9;
  color: #1f2d3d;
  box-sizing: border-box;
  border-radius: 4px;
  margin-bottom: 20px;
}

.select_list li {
  display: inline-block;
  width: 40%;
  padding:3px 4%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
  list-style: none;
  border-radius: 4px;
  cursor: pointer;
}
.select_list li i{
  position: absolute;
  right: 10px;
  top:13px;
  display: none;

}
.select_list li:hover{
  background-color: #f1f0f0;
}
.select_list li:hover i{
  display: block
}
</style>
