<!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="addForm">
        <el-form-item label="选择新闻" prop="newsId">
          <!--<trans-module @select="select"></trans-module>-->
          <ul class="select_list">
            <li v-for="newItem in value3" :key="newItem.id">{{ newItem.id }} 是否大图展示：
              <el-switch v-model="newItem.bigPic" @change="onleOne(newItem.id)" on-text="" off-text="">
              </el-switch>
            </li>
          </ul>
          <el-transfer v-model="editForm.newsId" :titles="['新闻列表', '选择列表']" :data="datas" @change="select">
            <!--<el-button   @click="changeData" size="small">更多</el-button>-->
            <el-select v-model="value4" class="transfer-footer" slot="left-footer"  @change="changeData" clearable size="small">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            <el-button class="transfer-footer" slot="right-footer" @click="getSelect" size="small">确认</el-button>
          </el-transfer>
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
          <el-input-number v-model="editForm.sort" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>