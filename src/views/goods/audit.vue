<template>
    <div class="saleList">
      <!--头部导航-->
      <div class="header">
        <div class="title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/' }">商品审核</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh()">刷新</el-button>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>筛选查询</span>
          <el-button style="float: right;margin-right: 20px;margin-top: -10px;" @click="resetData">重置</el-button>
          <el-button style="float: right;margin-top: -10px;margin-right: 20px"  @click="searchData">查询</el-button>
        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="输入搜索：">
            <el-input v-model="formInline.goods_name" placeholder="商品名称/货号/商户名" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <template>
              <el-select v-model="formInline.type" clearable placeholder="请选择">
                <el-option
                  v-for="item in goods_list"
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
                  v-for="item in audit_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-form>
      </el-card>
      <!--表格-->
      <el-card class="card-list" style="margin-top: 10px">
        <!--头部-->
          <div slot="header" class="clearfix" >
            <span>数据列表</span>
            <div class="sorts">
              <template>
                <el-select v-model="sort_value" clearable placeholder="排序方式" style="width: 120px"@change="changeSort">
                  <el-option
                    v-for="item in sort_list"
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="cid" show-overflow-tooltip label="编号" width="150"></el-table-column>
            <el-table-column show-overflow-tooltip label="商户" width="150">
              <template slot-scope="scope">
               {{scope.row.merchant_name ? scope.row.merchant_name : '暂无'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="商品图片" width="150">
             <template slot-scope="scope">
                <img :src="JSON.parse(scope.row.img)[0]"/>
               </template>
            </el-table-column>
            <el-table-column prop="name" show-overflow-tooltip label="商品名称"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="价格/货号" >
              <template slot-scope="scope">
                <div v-for="(item,index) in scope.row.sku" class="shopNames">
                  {{item.sku_font+';团购价:'+item.group_price+'单买价:'+item.goods_price}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="" show-overflow-tooltip label="标签" width="130">
              <template slot-scope="scope">
                {{scope.row.merchant_name ? scope.row.merchant_name : '暂无'}}
              </template>
            </el-table-column>
            <el-table-column prop="sort" show-overflow-tooltip label="排序" width="100"></el-table-column>
            <el-table-column prop="sale_num" show-overflow-tooltip label="销量" width="100"></el-table-column>
            <el-table-column prop="nickname" show-overflow-tooltip label="审核状态" width="130">
              <template slot-scope="scope">
                <div v-if="scope.row.is_audit==0">未审核</div>
                <div v-if="scope.row.is_audit==1">审核通过</div>
                <div v-if="scope.row.is_audit==2">审核未通过</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="getInfo(scope.row.cid)"><span style="color: #3baf22">查看</span></el-button>
                <el-button type="text"  @click="up_audit(scope.row,'dan')"><span style="color: #3baf22">审核</span></el-button>
              </template>
            </el-table-column>
          </el-table>
        <div class="saleListBottom" style="margin-top: 20px">
          <el-button size="mini" :disabled="selectDisabled" @click="allSelectStock(tableData)">全选</el-button>
          <el-button size="mini" :disabled="clearDisabled" @click="CleatAllSelectStock(tableData)">取消全选</el-button>
          <el-button size="mini" @click="audit_button">审核</el-button>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10,20,30]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
      <el-dialog
        title="商品审核"
        :visible.sync="dialogVisible"
        width="30%"
        >
         <div class="formList">
           <p>商品审核：
             <span>
              <el-radio v-model="radio" label="1">审核通过</el-radio>
              <el-radio v-model="radio" label="2">审核不通过</el-radio>
             </span>
           </p>
           <p v-if="radio=='2'">
             反馈详情：
             <el-input type="textarea" v-model="formData.content"></el-input>
           </p>
         </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click=" skip">确 定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
  import {api_user,evaluate} from "@/api/api.js"
  let apiUser = new api_user();
  let apiEvaluate=new evaluate()
    export default {
      name: "audit",
      data() {
        return {
          merchant_name: '暂无',
          formInline: {
            goods_name: '',
            type: '',
            status: ''
          },
          type_list: [
            {label: "仅退款", value: "1"},
            {label: "退货退款", value: "2"},
            {label: "取消订单", value: "3"},
            {label: "换货", value: "4"}
          ],
          //审核状态
          audit_list: [
            {label: "未审核", value: "0"},
            {label: "审核通过", value: "1"},
            {label: "审核未通过", value: "2"}
          ],
          sort_list: [
            {label: "正序", value: "0"},
            {label: "倒序", value: "1"}
          ],
          //商品分类下拉菜单
          goods_list: [],
          tableData: [],
          sort_value: "",//排序
          sort_value2: "",//编辑时的审核状态
          all_check: false,
          page: 1,
          limit: 10,
          total: 0,
          multipleSelection: [],
          multipleSelections: [],
          selectDisabled: false,
          clearDisabled: true, // 取消全选,
          dialogVisible: false,//对话框
          formData: {  //传入对话框需要的数据
            index: '',
            id: '',
            content: ''
          },
          radio: '1',//单选框
          choose_all: false//是否批量
        }
      },
      mounted() {
        let param = {
          page: this.page,
          limit: this.limit
        }
        this.getlist(param)
        this.get_cat()
      },
      methods: {

        refresh_item() { //刷新
          location.reload()
        },
        //初始化
        getlist(param) {
          apiUser.audit_list(param).then(res => {
            console.log(res)
            if (res.cscode == 0) {
              this.tableData = res.data.data
              this.total = res.data.count
            } else {
              this.$message(res.data.msg)
            }
          })
        },
        //商品分类
        get_cat() {
          var _this = this;
          var param = {}
          apiEvaluate.get_cat_assess(param).then(res => {
            console.log(res)
            var arr = res.data.data
            var arr_style = []
            if (res.cscode == 0) {
              for (var i = 0; i < arr.length; i++) {
                if (arr[i].children) {
                  var arr1 = arr[i].children
                  for (var j = 0; j < arr1.length; j++) {
                    var obj = {
                      label: arr1[j].cat_name,
                      value: arr1[j].id
                    }
                    arr_style.push(obj)
                  }
                }
              }


            }
            _this.goods_list = arr_style
          })

        },
        //商品审核
        up_audit(item) {
          this.dialogVisible = true
          this.formData.id = item.cid
          this.choose_all = false
        },
        //商品审核
        skip() {
          console.log(this.formData)
          if (this.choose_all) {
            console.log("aa")
            var arr = []
            if (this.radio == '2') {
              for(var i=0;i<this.multipleSelection.length;i++){
                var obj={
                  id: this.multipleSelection[i].id,
                  is_audit: "2",
                  audit_reason: this.formData.content
                }
                arr.push(obj)
              }
              let param = {
                data: arr
              }
              this.bao(param)
            }else {
              for(var i=0;i<this.multipleSelection.length;i++){
                var obj={
                  id: this.multipleSelection[i].id,
                  is_audit: "1",
                }
                arr.push(obj)
              }
              let param = {
                data: arr
              }
              this.bao(param)
            }
          } else {
            var arr = []
            if (this.radio == '2') {
              var obj = {
                id: this.formData.id,
                is_audit: "2",
                audit_reason: this.formData.content
              }
              arr.push(obj)
              let param = {
                data: arr
              }
              this.bao(param)

            } else {
              var obj = {
                id: this.formData.id,
                is_audit: "1",
              }
              arr.push(obj)
              let param = {
                data: arr
              }
              this.bao(param)
            }
          }

        },
        //批量审核
        audit_button() {
          if (this.multipleSelection.length > 0) {
            this.choose_all = true
            this.dialogVisible = true
            console.log(this.multipleSelection)
            /* let param={id:this.multipleSelection}
             console.log(param)
             apiUser.audit_up(param).then(res => {
               console.log(res)
               this.$message(res.data.msg)
               if(res.cscode==0){
                   let param={
                     page:this.page,
                     limit: this.limit
                   }
                   this.getlist(param)
               }
             })*/
          } else {
            this.$message('请选择你要审核的商品')
          }

        },
        bao(param) {
          apiUser.audit_up(param).then(res => {
            console.log(res)
            this.$message(res.data.msg)
            if (res.cscode == 0) {
              this.radio = '1'
              this.formData.content = ''
              let param = {
                page: this.page,
                limit: this.limit
              }
              this.getlist(param)
              this.dialogVisible = false
            }
          })
        },
        //全选事件
        allSelectStock(rows) {
          var _this = this;
          _this.multipleSelection = rows;
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, _this.allSelect);
          });
      },
      //取消全选事件
      CleatAllSelectStock(rows) {
        var _this = this;
        _this.multipleSelection = rows;
        console.log(rows)
        this.$refs.multipleTable.clearSelection();
      },
      //搜索条件
      searchData() {
        console.log(this.formInline)
        this.firstcheck = false,
          this.secondcheck = true,
          this.thirdcheck = false
        this.all_check = false
        this.$refs.multipleTable.clearSelection();
        if (this.formInline.goods_name == '' && this.formInline.type == '' && this.formInline.status == '') {
          this.$message('请输入搜索条件')
        } else {
          let param = {
            name: this.formInline.goods_name,
            classify: this.formInline.type,
            is_audit: this.formInline.status,
            page: 1,
            limit: this.limit
          }
          this.getlist(param)
          //页码初始化
          this.paginationShow = false
          this.handleCurrentChange(1)
          this.$nextTick(function () {
            this.paginationShow = true;
          })
        }
      },
      //排序
      changeSort() {
        this.firstcheck = false,
          this.secondcheck = false,
          this.thirdcheck = true
        this.all_check = false
        this.$refs.multipleTable.clearSelection();
        let param = {
          name: this.formInline.goods_name,
          classify: this.formInline.type,
          is_audit: this.formInline.status,
          rank: this.sort_value,
          page: 1,
          limit: this.limit
        }
        console.log(param)
        this.getlist(param)
        //页码初始化
        this.paginationShow = false
        this.handleCurrentChange(1)
        this.$nextTick(function () {
          this.paginationShow = true;
        })
      },
      handleSelectionChange(val) {
        var _this = this;
        _this.multipleSelection = val;
        if (_this.multipleSelection.length < _this.tableData.length) {
          _this.selectDisabled = false;
          _this.clearDisabled = true
        } else {
          _this.selectDisabled = true;
          _this.clearDisabled = false
        }
        /*let _this = this
          _this.multipleSelection = val;
          console.log(_this.multipleSelection)
          if(val.length==0){
            _this.isDisabled1=false
          }
          if(val.length>0){
            _this.isDisabled1=true
          }*/
      },

      //重置条件
      resetData() {
        for (var item in this.formInline) {
          this.formInline[item] = ''
        }
        this.firstcheck = true,
          this.secondcheck = false,
          this.thirdcheck = false
        let param = {
          page: 1,
          limit: this.limit
        }
        this.getlist(param)
        //页码初始化
        this.paginationShow = false
        this.handleCurrentChange(1)
        this.$nextTick(function () {
          this.paginationShow = true;
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.all_check = false
        this.limit = val
        if (this.firstcheck) {
          let param = {
            page: this.page,
            limit: this.limit
          }
          this.getlist(param)
        } else if (this.secondcheck) {
          let param = {
            name: this.formInline.goods_name,
            classify: this.formInline.type,
            is_audit: this.formInline.status,
            page: this.page,
            limit: this.limit
          }
          this.getlist(param)
        } else if (this.thirdcheck) {
          let param = {
            name: this.formInline.goods_name,
            classify: this.formInline.type,
            is_audit: this.formInline.status,
            rank: this.sort_value,
            page: this.page,
            limit: this.limit
          }
          this.getlist(param)
        }
        if (this.all_check) {
          this.tableData.forEach(row => {
            console.log(row)
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        }
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page = val
        this.all_check = false
        if (this.firstcheck) {
          let param = {
            page: this.page,
            limit: this.limit
          }
          this.getlist(param)
        } else if (this.secondcheck) {
          let param = {
            name: this.formInline.goods_name,
            classify: this.formInline.type,
            is_audit: this.formInline.status,
            page: this.page,
            limit: this.limit
          }
          this.getlist(param)
        } else if (this.thirdcheck) {
          let param = {
            name: this.formInline.goods_name,
            classify: this.formInline.type,
            is_audit: this.formInline.status,
            rank: this.sort_value,
            page: this.page,
            limit: this.limit
          }
          this.getlist(param)
        }
        /*if(this.all_check){
            console.log("11")
            this.$refs.multipleTable.clearSelection();
            this.tableData.forEach(row => {console.log(row)
              this.$refs.multipleTable.toggleRowSelection(row);
              console.log("qq")
            });
          }*/

      },
      //查看看商品详情
      getInfo(id) {
        console.log(id)
        this.$router.push({path: 'goodsDetails', query: {id: id,types:'audit'}})
      }
      },
    }
</script>

<style scoped>
  .saleList .sorts{margin: 0;padding: 0}
  .saleList .sorts .el-select{float: right;margin-top: -30px}
  .saleList  .el-pagination{margin-top: 20px}
  .saleList table img{width: 70px;height: 70px}
  .saleList .shopNames{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .saleList .formList p{overflow: hidden;margin-bottom: 20px}
  .saleList .formList p span{margin-left: 20px;}

</style>
<style>
  .saleList .formList p .el-textarea__inner{width: 60%;float: left;margin-left: 90px;margin-top: -16px}
</style>
