<template>
	<div class="userlist_backgruad">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">用户</el-breadcrumb-item>
			<el-breadcrumb-item>考核列表</el-breadcrumb-item>
			<el-breadcrumb-item>用户考核</el-breadcrumb-item>
		</el-breadcrumb>

			<div class="user_list">

				<el-card class="box-card">
					<div slot="header" class="userlist_clearfix">
						<span style="float: left; font-size: 22px;">筛选查询</span>
						<el-button style="float: right;" @click="search_list">查询结果</el-button>
					</div>
					<div class="userlist_1">

						<el-form>
              <div style="float: left">
                <el-form-item label="推广人员账号 :" style="width: 150px">
                  <el-input v-model="mobile"></el-input>
                </el-form-item>
              </div>
              <div style="float: left;margin-left: 130px">
                <el-form-item label="姓名 :" style="width: 150px">
                  <el-input v-model="sale_name"></el-input>
                </el-form-item>
              </div>
              <div style="float: left;margin-left: 100px">
                <el-form-item label="注册时间 :">
                  <el-date-picker
                    v-model="registertime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="longtime">
                  </el-date-picker>
                </el-form-item>
              </div>
						</el-form>
					</div>
				</el-card>
			</div>
      <hr />
			<div>
					<div slot="header" class="clearfix">
              <span style="width: 40%;float: left;margin-bottom: 20px">数据列表</span>
              <!--<el-tooltip class="item" effect="dark" content="请选择用户" placement="top">
                <el-button style="float: right;" @click="dialogVisible = true">发送系统消息</el-button>
              </el-tooltip>-->
            <el-select v-model="order_rule" clearable placeholder="排序方式" style="width: 110px" @change="changeRules">
              <el-option label="正序时间" value="1"></el-option>
              <el-option label="倒序时间" value="2"></el-option>
            </el-select>
            <!--<el-button style="margin-right: 10px;">导出数据</el-button>
            <el-button @click="batchOn(multipleSelection)" style="margin-right: 10px;">设置标签</el-button>
            <el-button @click="batchOn(multipleSelection)">推送</el-button>
            <el-button @click="batchOn(multipleSelection)">赠送智搜币</el-button>
            <el-button @click="batchOn(multipleSelection)">群发短信</el-button>-->
            <el-button @click="updataStau(1)">添加推销员</el-button>
            <div>
            </div>
					</div>
					<!--用户详情列表-->
					<div class="userlist_3" style="border-color: #333333">
						<el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
                      style="width: 100%;margin-bottom: 20px"
                      @selection-change="handleSelectionChange">
							<el-table-column type="selection" width="55">
							</el-table-column>
              <el-table-column label="推广人员ID" width="150">
                <template slot-scope="scope">{{ scope.row.id }}</template>
              </el-table-column>
              <el-table-column label="账号（手机号）" width="150">
                <template slot-scope="scope">{{ scope.row.mobile ? scope.row.mobile :'暂无' }}</template>
              </el-table-column>
              <el-table-column label="姓名" width="100">
                <template slot-scope="scope">{{ scope.row.sale_name ? scope.row.sale_name :'暂无' }}</template>
              </el-table-column>
              <el-table-column label="推广人员等级（保留字段）" width="200">
                <template slot-scope="scope">{{ scope.row.grade ? scope.row.grade :'暂无' }}</template>
              </el-table-column>
							<el-table-column label="推广店铺数" width="150">
								<template slot-scope="scope">{{ scope.row.shop_num ? scope.row.shop_num :'0' }}</template>
							</el-table-column>
              <el-table-column label="店铺有效订单总数" width="150">
                <template slot-scope="scope">{{ scope.row.ord_num ? scope.row.ord_num :'0' }}</template>
              </el-table-column>
              <el-table-column label="考核状态" width="150">
                <template slot-scope="scope">{{ scope.row.chk ? scope.row.chk :'暂无' }}</template>
              </el-table-column>

              <el-table-column label="账户启用状态" width="150">

                <template slot-scope="scope"> <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66" inactive-color="#CBD0D6"
                  @change="changestatus(scope.row)">
                </el-switch> </template>
              </el-table-column>
								<el-table-column label="操作">
								      <template slot-scope="scope">
                        <strong class="info"
                          @click="$router.push({path:'EmployeeInfo',query:{id:scope.row.id}})">查看</strong>
                        <strong class="update"
                          size="mini"
                          @click="handleEdit(scope.row.id)">编辑</strong>
                        <strong class="delete"
                          @click="handleDelete(scope.row.id, scope.row)">删除</strong>
                        <strong class="info"
                          @click="/*handleDelete(scope.row.id, scope.row)*/">考核</strong>
								      </template>
						    </el-table-column>
						</el-table>
            <div>
              <el-button size="mini" :disabled="selectDisabled" @click="allSelectStock(tableData)">全选</el-button>
              <el-button size="mini" :disabled="clearDisabled" @click="CleatAllSelectStock(tableData)">取消全选</el-button>
              <template>
                <el-select v-model="audit_value" clearable placeholder="批量选择"
                           style="width: 150px;margin-left: 50px">
                  <el-option
                    v-for="item in auditarr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
              <template>
                <el-button type="text" style="margin-left: 50px" @click="piliang">确定</el-button>
              </template>
            </div>

						<div style="margin-top: 20px">
							<el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="countnum"
                :current-page="currentPage"
                :page-sizes="[10,20,30,40,50]"
                @prev-click="prevPages"
                @next-click="nextPages"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper">
							</el-pagination>
						</div>
					</div>

			</div>
	</div>
</template>

<script>
  import {api_user,distribution} from "@/api/api.js"
  let apiUser = new api_user();
  let apiDistribution = new distribution();
	export default {
    data() {
      return {
        sale_name:'',
        mobile:'',
        registertime: '',
        name: '',
        options: [],
        value4: '',
        tableData: [],
        pagesize: 10,
        countnum: 0,
        currentPage: 1,
        t_start: '',
        t_end: '',
        selectDisabled: false,
        clearDisabled: true, // 取消全选,
        value5:true,
        all_check:'',         //全选
        order_rule:'',        //排序状态
        auditarr: [{
          value: '0',
          label: '启用'
        }, {
          value: '1',
          label: '禁用'
        }, {
          value: '2',
          label: '删除'
        }],
        audit_value: ''       //批量状态
      }
    },
    mounted: function () {
      this.get_list()
    },
    methods: {
      get_list() {
        let vm =this
        var sort=''
        if (this.order_rule){
          sort=this.order_rule
        }else {
          sort='1'
        }
        let param = {
          limit: this.pagesize,
          page: this.currentPage,
          mobile:this.mobile,
          sale_name: this.sale_name,
          start_time: this.t_start,
          end_time:this.t_end,
          status:sort
        }
        apiUser.saleList(param).then(res => {
          if (res.cscode == 0) {
            this.$message(res.data.msg)
            res.data.data.forEach(function (item,index) {
              if (item.status==1){
                res.data.data[index].status = true
              }else {
                res.data.data[index].status = false
              }
            })
            vm.tableData = res.data.data

            console.log( vm.tableData)
            this.countnum = res.data.count
          }else {
            this.$message.error(res.data.msg)
          }
        })
      },
      //一段时间
      longtime(val) {
        var _this = this
        _this.registertime=val
        if (val) {
          var first_time = Number(String(new Date(val[0]).getTime()).slice(0, 10))
          var last_time = Number(String(new Date(val[1]).getTime()).slice(0, 10))
          _this.t_start = first_time
          _this.t_end = last_time
        }
      },
      search_list() {
        if(this.mobile=='' && this.sale_name=='' && this.registertime==''){
          this.$message.error("请输入搜索内容")
        }else {
          this.get_list()
          //页码初始化
          this.paginationShow = false
          this.handleCurrentChange(1)
          this.$nextTick(function () {
            this.paginationShow = true;
          })
        }

      },
      //跳转编辑页面
      handleEdit(id){
        this.$router.push({path:'EmployeeRedact',query:{id:id}})
      },
      changestatus(row){
        if(row.status == true){
          var status = 2
        }else {
          var status = 1
        }
        let param = {sale_id:row.id,status:status}
        apiUser.changestatus(param).then(res => {
          if(res.cscode==0){
            this.$message.success(res.data.msg)
          }
        })
      },
      handleDelete(row){
        let vm =this
        vm.$confirm('确定要删除此用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param={sale_id:row}
          apiUser.deleteSaler(param).then(res => {
            if(res.cscode==0){
              this.$message({type: 'success',message:res.data.msg, showClose: true,})
            }else {
              this.$message(res.data.msg)
            }
              vm.get_list()
              // this.$message.success(res.data.msg)
          })

        }).catch(() => {

        });
      },
      handleSelectionChange(val) {
        var _this = this;
        _this.multipleSelection = val;
        if (_this.multipleSelection.length < _this.tableData.length) {
          console.log("aa")
          _this.selectDisabled = false;
          _this.clearDisabled = true
        } else {
          console.log("bb")
          _this.selectDisabled = true;
          _this.clearDisabled = false
        }
      },
      //拍序
      changeRules(){
       this.get_list()
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
      piliang(){
        console.log(this.audit_value)
        console.log(this.multipleSelection)
        if(this.multipleSelection && this.audit_value){
          if(this.audit_value==0){//启用
            console.log("aa")
              this.batchOn(this.multipleSelection)
            }else if(this.audit_value==1){//停用
            console.log("bb")
              this.batchOff(this.multipleSelection)
            }else { //删除
            this.allDelete(this.multipleSelection)
            }
        }else {
          this.$alert("请选择要操作的内容", '提示信息', {
            confirmButtonText: '确定',
          })
        }

      },

      // 批量启动
      batchOn:function(rows){
        console.log(rows)

          this.$confirm("确定启用吗", '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            for (var i = 0; i < rows.length; i++) {
              ids.push(rows[i].id)
            }
            let idss = ids.join(",");
            let param = {
              sale_id: idss, // 批量传递一维数组，单独的传递ID
              status: 2,
            };
            console.log(param);
            apiUser.upd_sales_status(param).then(res => {
                console.log(res);
              if(res.cscode==0){
                this.$message({type: 'success',message:res.data.msg, showClose: true,})
                this.get_list()
              }else {
                this.$message(res.data.msg)
              }

            })
          }).catch(()=>{})


      },
      // 批量停用
      batchOff(rows){
          this.$confirm("确定禁用吗", '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            for (var i = 0; i < rows.length; i++) {
              ids.push(rows[i].id)
            }
            let idss = ids.join(",");
            let param = {
              sale_id: idss, // 批量传递一维数组，单独的传递ID
              status: 1, // 分销列表信息--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
            };
            apiUser.upd_sales_status(param).then(res => {
              console.log(res);
              if(res.cscode==0){
                this.$message({type: 'success',message:res.data.msg, showClose: true,})
                this.get_list()
              }else {
                this.$message(res.data.msg)
              }
              this.get_list()
            })
          }).catch(()=>{})
      },
      //批量删除
      allDelete:function(rows){
        this.$confirm("确定删除吗", '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          for (var i = 0;i<rows.length;i++){
            ids.push(rows[i].id)
          }
          let idss = ids.join(",");
          let param ={
            sale_id:idss, // 批量传递一维数组，单独的传递ID
          };
          console.log(param);
          apiUser.deleteSaler(param).then(res => {
            if(res.cscode==0){
              this.$message({type: 'success',message:res.data.msg, showClose: true,})
              this.get_list()
            }else {
              this.$message(res.data.msg)
            }

            // this.$message.success(res.data.msg)
          })
        }).catch(()=>{})
      },

    //分页改变每页条数
    handleSizeChange(num) {
      var _this = this;
      _this.pagesize = num
      _this.currentPage=1
     _this.AllPagesPages(num)
    },

    //分页改变页数
    handleCurrentChange(pages) {
      var _this = this;
      _this.currentPage = pages
      _this.AllPagesPages()
    },

    //分页上一页
    prevPages(index) {
      var _this = this;
      _this.currentPage = index
      _this.AllPagesPages()
    },

    //分页下一页
    nextPages(index) {
      var _this = this;
      _this.currentPage = index
      _this.AllPagesPages()
    },
    //不同情况下的  页码
    AllPagesPages() {
        var _this=this
      this.get_list();

    },
    updataStau(item){
      if(item==1){
        this.$router.push('EmployeeRedact')
      }
    }
		},

	}
</script>

<style scoped>
@import url("../../assets/css/UserList.css");
.el-breadcrumb{font-size: 14px}
.el-form{width: 1000px;background: red}
  .clearfix  button,.clearfix .el-select{float: right;margin-top: -15px}
</style>
