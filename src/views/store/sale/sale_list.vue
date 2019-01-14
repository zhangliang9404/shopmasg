<template>
    <div class="saleList">
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
          <el-breadcrumb-item :to="{ path: '/' }">客服</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">售后</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">售后列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" icon="el-icon-refresh" @click="$router.back(-1)">返回</el-button>
      </div>
      <!--卡片查询-->
      <el-card class="card-search">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="输入搜索：">
            <el-input v-model="formInline.goods_name" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="售后类型：">
            <template>
              <el-select v-model="formInline.type" clearable placeholder="请选择">
                <el-option
                  v-for="item in type_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="审核状态：">
            <template>
              <el-select v-model="formInline.status" clearable placeholder="请选择">
                <el-option
                  v-for="item in status_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="操作时间：">
            <template>
              <el-date-picker v-model="formInline.up_time" type="date" placeholder="选择日期时间"></el-date-picker>
            </template>
          </el-form-item>
          <el-button style="float: right">查询</el-button>
        </el-form>
      </el-card>
      <!--表格-->
      <el-card class="card-list" style="margin-top: 10px">
        <!--头部-->
          <div slot="header" class="clearfix" >
            <span>数据列表</span>
            <div class="sorts">
              <template>
                <el-select v-model="sort_value" clearable placeholder="排序方式" style="width: 120px">
                  <el-option
                    v-for="item in status_list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </div>

          </div>
          <el-table
            border
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}"
            tooltip-effect="dark"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="订单编号" width="130"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="子单号" width="130"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="售后类型" width="130"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="是否退货" width="130"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="收件人" width="130"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="联系方式" width="130"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="支付时间" width="130"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="审核状态" width="130"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="操作人" width="130"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="操作时间" width="130"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="getInfo(scope.row.group_id)"><span style="color: #3baf22">查看</span></el-button>
              </template>
            </el-table-column>
          </el-table>
        <div class="saleListBottom">
          <el-checkbox-group v-model="all_check">
            <el-checkbox label="全选" name="type"></el-checkbox>
            <el-button type="text" @click="" style="margin: 0 20px">批量删除</el-button>
            <el-button type="text" @click="">删除</el-button>
          </el-checkbox-group>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>
      </el-card>
    </div>
</template>

<script>
    export default {
         name: "sale_list",
         data(){
            return{
              formInline:{},
              type_list:[
                {label:"仅退款",value:"1"},
                {label:"退货退款",value:"2"},
                {label:"取消订单",value:"3"},
                {label:"换货",value:"4"}
              ],
              status_list:[
                {label:"待处理",value:"1"},
                {label:"处理完成",value:"2"},
              ],
              tableData:[],
              sort_value:"",
              all_check:'',
              currentPage4:1
            }
         },
      methods: {
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        }
      },
    }
</script>

<style scoped>
  .saleList .header{
    border-bottom: 1px solid #eee;
    height: 45px;
    position: relative;
    overflow: hidden;
  }
  .saleList .header button{
    position: absolute;
    left: 80%;
    top:0;
  }
  .saleList .sorts{margin: 0;padding: 0}
  .saleList .sorts .el-select{float: right;margin-top: -30px}
  .saleList  .el-pagination{margin-top: 20px}
</style>
