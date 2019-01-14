<template>
  <div class="group">
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">营销</el-breadcrumb-item>
      <el-breadcrumb-item>促销活动</el-breadcrumb-item>
      <el-breadcrumb-item>团购</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="explanation"><i class="el-icon-setting"></i>团购活动：管理所有团购活动--点击排序列表中的数字可对团购商品进行排序</p>
    <!--搜索-->
    <el-input placeholder="请输入内容" v-model="name" class="search" @keyup.enter.native="seach()">
      <template slot="prepend">商品名称</template>
      <el-button slot="append" @click="seach()" icon="el-icon-search">查询</el-button>
    </el-input>
    <el-button style="margin: 10px" type="primary" icon="el-icon-plus" @click="$router.push('addGroup')">添加团购活动</el-button>
    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="limit"
                   layout="total, sizes, prev, pager, next, jumper" :total="count">
    </el-pagination>
    <!--按钮-->
    <el-button-group class="operatebutton">
      <el-button type="success" size="mini" icon="el-icon-success" plain @click="toggleSelect(tableData)">全选</el-button>
      <el-button type="primary" size="mini" icon="el-icon-check" plain @click="toggleSelection(tableData)">反选</el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" plain @click="batchDeleting(multipleSelection)">批量删除</el-button>
    </el-button-group>

    <!--促销团购列表-->
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" class="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>商品名称: {{ scope.row.goods_name }}</p>
            <p>开始时间: {{ scope.row.start_date }}</p>
            <p>结束时间: {{ scope.row.ending_date }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.goods_name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="200">
        <template slot-scope="scope" >
          <span>{{ scope.row.start_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.ending_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="限购" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.buy_bounds }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订购商品"width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.buy_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单"width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.order_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前价格"width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.group_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="saveSort(scope.row.id)">{{scope.row.sort}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="104">
        <template slot-scope="scope">
          <el-button type="text" >
            <router-link :to="{path:('updateGroup'),query: {id: scope.row.id}}" style="color: #3baf22">编辑</router-link>
          </el-button>
          <!--当状态等于7的时候可以点击删除，否则删除按钮禁用-->
          <el-button v-if="scope.row.status_num == '7'" type="text" @click="handleDelete(scope.row.id)"><span style="color: #af180e" >删除</span></el-button>
          <el-button v-else disabled type="text" ><span style="color: #af180e" >删除</span></el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>
  import * as utils from "@/common/utils.js"
  import {api_active} from "@/api/api.js" // export class api_user{}中的总名称
  let apiActive = new api_active(); // 给api_user另命名
  export default {
    name:'group',
    data() {
      return {
        name:'', // 搜索的商品名称
        currentPage:1, // 当前页码
        limit:10, // 每页条数
        count:0, // 总条数
        tableData:[], // 促销团购的列表信息
        multipleSelection: [], // 选择的每一列
        allSelect:false, // 全选
        formLabelWidth: '120px', //表格宽度
      }
    },
    // created() {
    //   this.$emit('refreshList'); //触发父类的事件，写法
    // },
    //页面预加载执行
    mounted: function(){
      this.checkGroup();//检查团购
    },
    methods: {
      //检查团购
      checkGroup(){
        let param = {};
        param = utils.filterJson(param);
        apiActive.checkGroup(param).then(res => {
          console.log(res);
          if(res.cscode == "0"){
            this.getlist();//获取促销团购列表
          }
        });
      },
      //获取促销团购列表
      getlist() {
        let _this = this;
        let param = {
          page:_this.currentPage,//当前页码
          limit:_this.limit//每页多少条数据
        };
        param = utils.filterJson(param);
        apiActive.getGroupList(param).then(res => {
          console.log(res);
          if(res.cscode == "0"){
            _this.tableData = res.data.data;//促销团购的列表
            _this.count = res.data.count;//总数量
          }else{
            // _this.$alert(res.data.msg, '提示信息', {
            //   confirmButtonText: '确定'
            // });
          }
        });
      },
      //分页
      handleSizeChange(val) {
        let _this = this;
        _this.limit = val;
        _this.getlist();
      },
      //分页
      handleCurrentChange(val) {
        let _this = this;
        _this.currentPage = val;
        _this.getlist();
      },
      // 删除订单
      handleDelete:function(id){
        this.$confirm('执行此操作团购商品将被删除, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(id);
          let param ={
            status:'1',
            id:id,
          };
          apiActive.delGroup(param).then(res=>{
            console.log(res);
            if(res.cscode === "0"){
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getlist()
                }
              })
            }else{
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
              })
            }
          })
        }).catch(() => {
        });
      },
      //查找，搜查
      seach(){
        let _this = this;
        let param = {
          page:_this.currentPage,//当前页码
          limit:_this.limit,//每页多少条数据
          name:_this.name,
        };
        param = utils.filterJson(param);
        apiActive.getGroupList(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            _this.tableData = res.data.data;//促销团购的列表
            _this.count = res.data.count;//总数量
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
            _this.tableData = res.data.data;//促销团购的列表
          }
        });
      },
      // 全选
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
      //反选
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      // 批量删除--有点问题，见备注
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
            let param ={
              status:'2',
              id:ids,
            };
            apiActive.delGroup(param).then(res=> {
              console.log(res);
              if (res.cscode === "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getlist()
                  }
                })
              }else{
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                })
              }
            })
          }).catch(() => {
          })
        }else {
          this.$alert("请选择要删除的内容", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      //保存排序
      saveSort(id){
        this.$prompt('请输入您所想要的排序位置', '团购排序', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\+?[1-9][0-9]*$/,//非零正整数
          inputErrorMessage: '排序的数字需为非零正整数'
        }).then(({ value }) => {
          let param = {
            sort:value,//排序
            id:id,//id
          };
          console.log(param);
          param = utils.filterJson(param);
          apiActive.updateSort(param).then(res => {
            if(res.cscode === "0"){
              this.getlist();//获取团购列表
            }else{
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定'
              });
            }
          });
        }).catch(() => {
        });
      },
      //每一项的选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },

  }
</script>

<style scoped>
  @import url("../../assets/css/Promotion.css");
</style>
<style>
  .group .cell{text-align: center;}
</style>
