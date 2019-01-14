<template>
  <div class="goofoutb_backgroud">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>营销</el-breadcrumb-item>
      <el-breadcrumb-item>商品促销</el-breadcrumb-item>
      <el-breadcrumb-item>限时优惠</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form style="width:100%">
      <div class="user">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="overflow: hidden">
            <!--<span style="width: 50%;float: left; font-size: 22px;">筛选查询</span>-->
            <div style="float: left;overflow:hidden;">
              <el-button style="float: left;" @click="addactive">添加</el-button>
            </div>
          </div>
          <div class="character">
            <!--商品名称-->
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="商品名称 :">
                <el-input v-model="formInline.goods_name" placeholder="商品名称"></el-input>
              </el-form-item>
              <!--用户昵称-->
              <el-form-item label="活动名称 :">
                <el-input v-model="formInline.title" placeholder="活动名称"></el-input>
              </el-form-item>
              <el-form-item label="选择时间 :">
              <el-date-picker
                v-model="formInline.datetime"
                type="datetimerange"
                range-separator="至"
                value-format="timestamp"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

              <el-form-item label=" ">
                <el-button style="float: left;" @click="queryStock">查询</el-button>
                <el-button style="float: left;" @click="sortsave">排序保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
      <div >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="width: 40%;float: left;">数据列表</span>
            <el-select v-model="formInline.rule" style="float: right" placeholder="排列方式" @change="changeSort">
              <el-option
                v-for="item in sortOrder"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!--数据列表显示-->
            <div  class="character3" style="border-color: #333333">
              <el-table ref="multipleTable"
                        :data="tableData"
                        stripe
                        current-row-key="index"
                        :border="true"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="商品ID" width="60" align="center">
                  <template slot-scope="scope">
                    <div class="template_content">
                      {{scope.row.id==null?"无":scope.row.id}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="template_content">
                      {{scope.row.goods_name==null?"无":scope.row.goods_name}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="规格/原价/团购价/单买价" width="200" >
                  <template slot-scope="scope">
                    <div class="template_content">
                      <el-tooltip v-for="(skuitem,index) in scope.row.sku_info" class="item" effect="dark" :key='index' :content="skuitem" placement="top">
                        <p>{{skuitem}}</p>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="限时团购价" width="200">
                  <template slot-scope="scope">
                    <div class="template_content">
                      <el-tooltip v-for="(skuitem,index) in scope.row.flashsale_gprice" :key="index" class="item" effect="dark" :content="skuitem" placement="top">
                          <p>{{skuitem}}</p>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="限时单买价" width="200">
                  <template slot-scope="scope">
                    <div class="template_content">
                      <el-tooltip v-for="(skuitem,index) in scope.row.flashsale_price" class="item" effect="dark" :key="index" :content="skuitem" placement="top">
                        <p>{{skuitem}}</p>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="amend" label="活动名称" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="template_content">
                      {{scope.row.title==null||scope.row.title==""?'无':scope.row.title}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="开始时间" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="template_content">
                      {{scope.row.flashsale_start==null?'无':scope.row.flashsale_start}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="结束时间" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="template_content">
                      {{scope.row.flashsale_end==null?'无':scope.row.flashsale_end}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="排序" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="template_content">
                      <el-input type="number" v-model="scope.row.sort" @blur="blursort(scope.row.id,scope.row.sort)" placeholder="请输入内容"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="scope" label="上下架" width="150" show-overflow-tooltip>
                  <template  slot-scope="scope">
                    <el-switch
                      v-model="scope.row.status"
                      active-color="#13ce66" inactive-color="#CBD0D6"
                      @change="change_up(scope.row,scope.row.status)"
                    >
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column prop="scope" label="操作">
                  <template slot-scope="scope">
                    <strong style="color: #13ce66!important" class="lookings" @click="edit_detail(scope.row)">编辑</strong>
                    <strong style="margin-left: 20px!important;color: #CBD0D6!important" @click="del_list(scope.row,'dan')">删除</strong>
                  </template>
                </el-table-column>
              </el-table>
              <div style="width: 90%;margin-top: 20px;overflow: hidden">
                <div class="methods" style="float: left">
                  <el-button size="mini" :disabled="selectDisabled" @click="allSelectStock(tableData)">全选</el-button>
                  <el-button size="mini" :disabled="clearDisabled" @click="CleatAllSelectStock(tableData)">取消全选</el-button>
                  <el-button size="mini" @click="del_list">删除</el-button>
                  <!--<el-button size="mini" @click="xainSelectStock">显示</el-button>-->
                  <!--<el-button size="mini" @click="yinSelectStock">隐藏</el-button>-->
                </div>
                <el-pagination style="float: right"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="pages.nowPages"
                               :page-sizes="[10,20,30,40,50]"
                               :page-size="pages.limit"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="pages.count"
                               @next-click="nextPages"
                               @prev-click="prevPages">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-form>
    <el-dialog
      title="添加"
      :visible.sync="addmodel">
      <el-row style="margin-top: 10px" >
        <el-col :span="4"><div class="grid-content bg-purple-dark" style="line-height: 30px">限时抢购商品：</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple-dark" style="text-align: center;border: 1px solid black;line-height: 30px" @click="showbuy">绑定商品/显示商品</div></el-col>
      </el-row>
      <el-row style="margin-top: 10px" v-if="choosegoods">
        <el-col :span="4"><div class="grid-content bg-purple-dark" style="line-height: 30px">所选限时抢购商品：</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple-dark" style="text-align: center">{{choosegoods.goods_name}}：</div></el-col>
      </el-row>
      <el-row style="margin-top: 10px" >
        <el-col :span="4"><div class="grid-content bg-purple-dark" style="line-height: 30px">限时抢购活动：</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple-dark" style="text-align: center;border: 1px solid black;line-height: 30px" @click="showactive">绑定活动/活动名称</div></el-col>
      </el-row>
      <el-row style="margin-top: 10px" v-if="choosetime">
        <el-col :span="4"><div class="grid-content bg-purple-dark" style="line-height: 30px">所选限时抢购活动：</div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple-dark" style="text-align: center">{{choosetime.title}}</div></el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="activesure">添加</el-button>
        <el-button type="primary" @click="pricemodel = false;choosegoods='';choosetime=''">重置</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑价格"
      width="80%"
      :visible.sync="pricemodel">
      <editprice :iteminfo="iteminfo"  @save="save"></editprice>
    </el-dialog>
    <el-dialog
      title="编辑时间"
      :visible.sync="detemodel">
      <div style="height: 500px">
        <el-date-picker
          v-model="detechange"
          type="datetimerange"
          range-separator="至"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
        <!--:default-time="[iteminfo.flashsale_start,iteminfo.flashsale_end]"-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detemodel = false">取 消</el-button>
        <el-button type="primary" @click="timesure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择商品"
      width="80%"
      :visible.sync="showbuymodel">
      <runbuy @cancle="cancle" :witch="witch" @surewhat="surewhat"></runbuy>
    </el-dialog>
  </div>
</template>

<script>
  import { api_active } from '@/api/api';
  import * as utils from "@/common/utils.js"
  import runbuy from  '@/views/template/promotion/runbuy'
  import runactive from  '@/views/template/promotion/runactive'
  import editprice from  '@/views/template/promotion/editprice'
  let apiActive = new api_active();
  export default {
   data(){
     return{
       tableData:[],
       multipleSelection:[],
       witch:'',
       iteminfo:[],
       sortarr:[],
       itemfortime:'',
       choosegoods:'',
       choosetime:'',
       detechange:[],
       formInline:{
         goods_name:'',
         title:'',
         datetime:[],
         rule:''
       },
       sortOrder:[
         {
           label:"正序",
           value:1
         },
         {
           label:"倒序",
           value:2
         },
       ],
       selectDisabled:false,
       clearDisabled:false,
       pages:{
         count:0,
         nowPages:1,//当前页数
         limit:10
       },
       allSelect:true,
       addmodel:false,
       pricemodel:false,
       detemodel:false,
       showbuymodel:false,
       showactivemodel:false
     }
   },
    mounted(){
      this.getlistdata()
    },
    methods:{
      getlistdata(){
       let vm = this
       let params = this.formInline
        if(this.formInline.datetime){
          params.add_time = this.formInline.datetime[0]/1000
          params.end_time = this.formInline.datetime[1]/1000
        }
       params.limit = this.pages.limit
       params.page =this.pages.nowPages
       apiActive.getgoodslimt(params).then(res => {
         if(res.cscode==0){
           vm.tableData = Object.values(res.data.info)
           vm.pages.count = res.data.count
           vm.tableData.forEach(x=>x.status=x.types==3?true:false)
         }else {
           vm.$message.error(res.data.msg);
         }
       })
     },
      activesure(){
       let vm =this
       if(!this.choosegoods){
         this.$message.error('请选择参加活动的商品')
         return
       }
       if(!this.choosetime){
         this.$message.error('请选择参加活动的时间')
         return
       }

       let params={
         op:'change_time',
         goods_id:this.choosegoods.id,
         flashsale_id:this.choosetime.id,
         flashsale_start:this.choosetime.add_time,
         flashsale_end:this.choosetime.end_time
        }
        apiActive.changeactive(params).then(res => {
          if(res.cscode==0){
            vm.$message.success(res.data.msg);
            vm.choosegoods=''
            vm.choosetime=''
            vm.getlistdata()
            vm.addmodel = false

          }else {
            vm.$message.error(res.data.msg);
          }
        })
      },
      sortsave(){
        if(this.sortarr.length==0){
          return this.$message.error('请输入变更排序')
        }
        let params={
          data:this.sortarr
        }
        let vm =this
        apiActive.sortgoods(params).then(res => {
          if(res.cscode==0){
            vm.$message.success(res.data.msg);
            vm.getlistdata()
          }else {
            vm.$message.error(res.data.msg);
          }
        })

      },
      del_list(row,where){
       if(where=='dan'){
         this.multipleSelection=[]
         this.multipleSelection.push(row.id)
       }
        let params = {
          op:'delete',
          goods_id:this.multipleSelection
        }
        let vm =this
        this.$alert('', '确定删除此商品？', {
          confirmButtonText: '确定',
          callback: action => {
            apiActive.deleteactive(params).then(res => {
              if(res.cscode==0){
                vm.$message.success(res.data.msg)
                vm.getlistdata()
              }else {
                vm.$message.error(res.data.msg)
              }
            })
          }
        });
      },
      change_up(row,status){
        let a=[];a[0] = row.id
        let vm =this
        let params = {
          op:'update',
          goods_id:a
        }
        if(status=='true'){
          params.types='0'
        }else {
          params.types='3'
        }
        apiActive.deleteactive(params).then(res => {
          if(res.cscode==0){
            vm.$message.success(res.data.msg)
            vm.getlistdata()
          }else {
            vm.$message.error(res.data.msg)
          }
        })



      },
      blursort(id,sort){
        if(Array.from(this.sortarr,x=>x.id).indexOf(id)==-1 || this.sortarr==[]){
          this.sortarr.push({'id':id,'sort':sort})
        }else {
          this.sortarr.splice(Array.from(this.sortarr,x=>x.id).indexOf(id),1,{'id':id,'sort':sort})
        }
      },
      handleSelectionChange(val){
        this.multipleSelection=[]
        val.forEach(x=>this.multipleSelection .push(x.id))
      },
      timesure(){
        let goods_id = this.itemfortime.id
        let flashsale_id = this.itemfortime.flashsale_id
        let flashsale_start = this.detechange[0]/1000
        let flashsale_end = this.detechange[1]/1000
        let vm =this
        let params={
          op:'change_time',
          goods_id:goods_id,
          flashsale_id:flashsale_id,
          flashsale_start:flashsale_start,
          flashsale_end:flashsale_end
        }
        apiActive.goodschange(params).then(res => {
          if(res.cscode==0){
            vm.$message.success(res.data.msg)
            vm.getlistdata()
            vm.detemodel = false
          }
        })
      },
      surewhat(what){
        if(what.choosegoods){
          this.choosegoods = what.choosegoods
        }
        if(what.choosetime){
          this.choosetime = what.choosetime
        }
        this.showbuymodel =false
      },
      allSelectStock(data){
        this.multipleSelection=[]
        let vm =this
        data.forEach(x=>this.multipleSelection .push(x.id))
        data.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row,vm.allSelect);
        });
      },
      CleatAllSelectStock(data){
        this.multipleSelection =data
        this.$refs.multipleTable.clearSelection();
      },
      showbuy(){
        this.showbuymodel = true
        this.witch = 'goods'
      },
      showactive(){
        this.showbuymodel = true
        this.witch = 'flashsale'
      },
      edit_detail(row){
        let vm = this
        this.$confirm('', '请选择编辑内容',{
          confirmButtonText: '编辑价格',
          cancelButtonText: '编辑时间',
          center: true
        }).then(() => {
          apiActive.getgoodsprice({goods_id:row.id}).then(res => {
            if(res.cscode==0){
              vm.iteminfo = res.data.info
              vm.pricemodel=true
            }
          })
        }).catch(() => {
          vm.detechange =[new Date(row.flashsale_start), new Date(row.flashsale_end)]
          vm.detemodel = true
          vm.itemfortime = row
        });
      },
      addactive(){
        this.addmodel = true
      },
      changeSort(){
        this.getlistdata()
      },
      queryStock(){
        this.getlistdata()
      },
      handleSizeChange(limit){
        this.pages.limit = limit
        this.getlistdata()
      },
      handleCurrentChange(index){
        this.pages.nowPages = index
        this.getlistdata()
      },
      nextPages(index){
        this.pages.nowPages = index
        this.getlistdata()
      },
      prevPages(index){
        this.pages.nowPages = index
        this.getlistdata()
      },
      save(){
        this.pricemodel = false
      },
      cancle(){
        this.showbuymodel = false
      },





    },
    components:{
      runbuy,runactive,editprice
    }


  }
</script>

<style scoped>
  @import url("../../assets/css/Inventory.css");

  .cell>.template_content{
    display: block;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .lookings{
    cursor: pointer;
  }
</style>
