<template>
    <div class="processing">
      <!--导航-->
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">客服</el-breadcrumb-item>
          <el-breadcrumb-item>建议反馈</el-breadcrumb-item>
          <el-breadcrumb-item>问题回复</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top_seacher">
        <el-button @click="Processed">已处理</el-button>
        <el-button @click="Untreated">未处理</el-button>
        <el-button>导出</el-button>
        <template>
          <div class="block">
            <el-date-picker
              v-model="pick_time"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              @change='selectTime'
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </template>
      </div>
      <div class="pre_table">
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          :default-sort = "{prop: 'date', order: 'descending'}"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" show-overflow-tooltip label="编号" width="200"></el-table-column>
          <el-table-column prop="problem" show-overflow-tooltip label="问题描述" width="400"></el-table-column>
          <el-table-column prop="nickname" show-overflow-tooltip label="用户名" width="200"></el-table-column>
          <el-table-column prop="create_time" show-overflow-tooltip label="问题提交时间" width="200"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="getInfo(scope.row.id)"><span style="color: #3baf22">查看</span></el-button>
              <el-button type="text" @click="handleDelete(scope.row.id)"><span style="color: #af180e" >删除</span></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pre_bottom">
        <el-checkbox-group v-model="all_check">
          <el-button type="text" @click="toggleSelect(tableData)">全选</el-button>
        </el-checkbox-group>
        <el-button @click="batchDeleting(multipleSelection)" type="text" label="1" style="border: none;outline: none;margin-left: 10px;">批量删除</el-button>
        <!--<el-button>提交</el-button>-->
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20,30,40,50]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count">
        </el-pagination>
      </div>
    </div>
</template>
<script>
  import * as utils from "@/common/utils.js"
  import {api_Chat} from "@/api/api.js"//export class api_Chat{}中的总名称
  let apiChat = new api_Chat();//给api_Chat另命名
    export default {
        name: "processing",
        data(){
          return{
            pick_time:'',
            tableData:[],
            all_check:'',
            check_radio:'',
            page:1,
            limit:10,
            count:'',//总条数
            status:'',//状态
            start_time:'',//开始时间
            end_time:'',//结束时间
            multipleSelection: [],//所选中表格的数组

          }
        },
      mounted(){
        this.getProblemList()//获取建议意见列表
      },
      methods: {
          // 获取建议意见列表
        getProblemList(){
          let _this = this
          let param ={
            status:_this.status,
            start_time:_this.start_time/1000,
            end_time:_this.end_time/1000,
            page: _this.page,
            limit:_this.limit,
          }
          apiChat.suggest_index(param).then(res=>{
            console.log(res);
            if(res.cscode==0){
              _this.tableData = res.data.data
              _this.count = res.data.count
            }
          })
        },
        // 点击未处理
        Untreated(){
          let _this = this
          _this.status = 1
          _this.getProblemList()
        },
        // 点击已处理
        Processed(){
          let _this = this
          _this.status = 2
          _this.getProblemList()
        },
        // 选择时间后
        selectTime(){
          let _this = this
          console.log(_this.pick_time);
          var start_time = new Date(_this.pick_time[0]);
          var end_time = new Date(_this.pick_time[1]);
          // 有三种方式获取
          _this.start_time = Date.parse(start_time);
          _this.end_time = Date.parse(end_time);
          console.log( _this.start_time);//1398250549123
          console.log(_this.end_time);//1398250549123
          _this.getProblemList()
        },
        //全选
        toggleSelect(rows){
          console.log(rows);
          if (rows) {
            rows.forEach(row => {
              console.log(row);
              this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect)
            });
            this.allSelect = !this.allSelect;
          }
        },
        // 删除表格数据
        handleDelete:function(id){
          this.$confirm('执行此操作将会删除本条聊天记录, 是否继续?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let param = id

            apiChat.del_suggest(param).then(res=>{
              console.log(res);
              if(res.cscode == "0"){
                this.getProblemList();
              }else{
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                })
              }
            })
          }).catch(() => {
          });
        },
        //选择表格
        handleSelectionChange(val) {
          console.log(val);
          this.multipleSelection = val;
          console.log(this.multipleSelection);
        },
        // 批量删除
        batchDeleting:function(rows){
          if(rows.length>0){
            this.$confirm("确定删除吗", '提示信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let ids = [];
              for (var i = 0;i<rows.length;i++){
                ids.push(rows[i].id)
              }
             this.handleDelete(ids)
              console.log(ids);
            }).catch(() => {
            })
          }else {
            this.$alert("请选择要删除的内容", '提示信息', {
              confirmButtonText: '确定',
            })
          }
        },
        //查看详情
        getInfo(id){
          this.$router.push({
            path:'/feedback',
            query: {
              id: id,
            }
          })
        },
        handleSizeChange(val) {
          let _this = this
          _this.limit = val
          _this.getProblemList()
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          let _this = this
          _this.page = val
          _this.getProblemList()
          console.log(`当前页: ${val}`);
        },
      },
    }
</script>

<style scoped>
  .processing .header{height: 30px;border-bottom: 1px solid #eee;margin-bottom: 30px;}
  .processing .top_seacher{overflow: hidden;margin-bottom: 30px}
  .processing .top_seacher button:nth-of-type(3){float: right}
  .processing .top_seacher .block{float: right}
  .processing .pre_bottom .el-checkbox-group{display: inline;}
  .processing .pre_bottom{margin: 30px auto}
  .processing .pre_bottom .el-radio{margin: 0 20px}

</style>
