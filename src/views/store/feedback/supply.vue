<template>
    <div class="supply">
      <div class="supply_left">
        <div><span class="el-icon-search po_mirror" v-if="supplier==''"></span></div>
        <div style="margin: 20px;">
          <el-input
            placeholder="商家昵称/账号"
            v-model="supplier"
            clearable>
          </el-input>
        </div>

        <ul>
          <li v-for="(item,index) in data_list" :class="{supp_bg:index==num}" @contextmenu.prevent="updata(index,$event)">
             <img :src="item.header_img" />
             <div class="box_tit">
               <p>{{item.name}}</p>
               <p>{{item.tit}}</p>
             </div>
             <div>{{item.data}}</div>
          </li>
        </ul>
      </div>
      <div class="supply_right">
        <div class="top">王五（一级代理/二级代理）</div>
        <ul>
          <li>
            <div class="datas">2017/08/11/09:00</div>
            <div class="merchant">商家回复：第三方科技</div>
            <div class="service">我的回复：德生科技军军军军军 </div>
          </li>
        </ul>
        <!--实时发送-->
        <div class="m-text">
          <el-radio v-model="radio" label="1">文字</el-radio>
          <el-radio v-model="radio" label="2">图片</el-radio>
          <div class="m-text-content" v-if="radio === '1'" >
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <el-input type="textarea" :rows="5" placeholder="在此输入回复的内容，点击回复或enter发送消息" v-model="textarea"
                      @keyup.enter.native="sendMessage()" class="textarea"></el-input>
            <el-button type="info" plain class="chat-btn" @click="sendMessage">回复</el-button>
          </div>
          <div class="m-text-content" v-else>
            <el-upload
              class="upload-demo"
              :class="{disabled:uploadDisabled}"
              name="file_name"
              :limit="1"
              :action="uplodeimg"
              list-type="picture-card"
              :before-upload="beforeUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              ref="upload"
              :file-list="fileList"
              :auto-upload="false">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <div slot="tip" class="el-upload__tip" style="float: left">只能发送一张jpg/png的文件，且不超过500kb</div>
            <el-button type="info" plain class="chat-btn" @click="submitUpload">回复</el-button>
          </div>

        </div>
      </div>
      <div style="clear: both"></div>
    </div>
</template>

<script>
    export default {
        name: "supply",
        data(){
          return{
            supplier:'',             //供应商
            dis_hidden:true,         //放大镜出现
            num:'q',
            data_list:[              //消息列表
              {
                header_img:require("../../../assets/img/bao.jpg"),
                name:"张三",
                tit:"fadnskljksajkkkkkkkkkkkkk",
                data:"2017/08/11/09:00"
              },
              {
                header_img:require("../../../assets/img/bao.jpg"),
                name:"张三",
                tit:"fadnskljksajkkkkkkkkkkkkk",
                data:"2017/08/11/09:00"
              },
              {
                header_img:require("../../../assets/img/bao.jpg"),
                name:"张三",
                tit:"fadnskljksajkkkkkkkkkkkkk",
                data:"2017/08/11/09:00"
              },
              {
                header_img:require("../../../assets/img/bao.jpg"),
                name:"张三",
                tit:"fadnskljksajkkkkkkkkkkkkk",
                data:"2017/08/11/09:00"
              }
            ],
            radio:"1",
            dialogVisible:false,
          }
        },
        methods:{
          updata(index,event){
            if( event.button==2){
              this.num=index
              this.$confirm('是否删除该聊天', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.num="q"
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
            }
          }
        }
    }
</script>

<style scoped>
  @import "../../../assets/css/supply.css";

</style>
<style>
  .supply .supply_left .el-input__inner{padding: 0 30px}
</style>
