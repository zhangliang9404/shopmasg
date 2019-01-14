<template>
  <div style="position: relative;padding-bottom: 50px">
    <el-input placeholder="请输入内容" v-model="name" class="input-with-select" style="width: 200px">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-table
      :data="tableData"
      border
      stripe
      key="goods"
      v-if="witch=='goods'"
      highlight-current-row
      @current-change="handleCurrentChangeGoods"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="商品名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="name"
        label="规格//团购价/单买价（元）"
        width="400">
        <template slot-scope="scope">
          <div class="template_content">
            <el-tooltip v-for="(skuitem,index) in scope.row.goods" :key='index' class="item" effect="dark" :content="skuitem.sku_font+skuitem.cost_price+'¥,'+skuitem.group_price+'¥,'+skuitem.goods_price+'¥'" placement="top">
              <p  class="yu">{{skuitem.sku_font+skuitem.cost_price+'¥,'+skuitem.group_price+'¥,'+skuitem.goods_price+'¥'}}</p>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="scope"
        label="操作">
        <template slot-scope="scope">

          <el-checkbox v-model="scope.row.checked">&nbsp;</el-checkbox>
          <!--<el-radio class="radio" :label="scope.$index" v-model="radio">&nbsp;</el-radio>-->
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="tableDatanew"
      border
      stripe
      key="flashsale"
      v-if="witch=='flashsale'"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="活动名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="flashsale_start"
        label="开始时间"
        width="180">
        <template slot-scope="scope">
          <div class="template_content">
            {{zhuan(scope.row.add_time)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="flashsale_end"
        label="结束时间">
        <template slot-scope="scope">
          <div class="template_content">
            {{zhuan(scope.row.end_time)}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="scope"
        label="操作">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked">&nbsp;</el-checkbox>
          <!--<el-radio class="radio" :label="scope.$index" v-model="radio" key="goods">&nbsp;</el-radio>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      small
      layout="prev, pager, next"
      @current-change="changepage"
      :total="total">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" v-if="witch=='goods'" @click="suregoods">确 定</el-button>
        <el-button type="primary" v-if="witch=='flashsale'" @click="suretime">确 定</el-button>
      </span>
    <el-dialog
      title="编辑价格"
      width="80%"
      :modal="false"
      :visible.sync="pricemodel">
      <editprice @save="save" :iteminfo="iteminfo"></editprice>
    </el-dialog>
  </div>
</template>

<script>
  import { api_active } from '@/api/api';
  import * as utils from '@/common/utils'
  import editprice from  '@/views/template/promotion/editprice'
  let apiActive = new api_active();
  export default {
    props:['witch'],
    data(){
      return{
        name:'',
        radio:false,
        tableData:[],
        tableDatanew:[],
        total:0,
        choosegoods:'',
        choosetime:'',
        page:1,
        iteminfo:[],
        pricemodel:false,
        changegoodsprice:'',
      }
    },
    mounted(){
      this.getlist()
    },
    methods:{
      goodslistchecked(){},
      suregoods(){
        this.$emit('surewhat',{'choosegoods':this.choosegoods})
      },
      suretime(){
        this.$emit('surewhat',{'choosetime':this.choosetime})
      },
      save(){
        this.pricemodel = false
      },
      cancle(){
        this.$emit('cancle')
      },
      changeprice(row){
        let vm =this
        apiActive.getgoodsprice({goods_id:row.id}).then(res => {
          if(res.cscode==0){
            vm.iteminfo = res.data.info
            vm.pricemodel=true
          }
        })
      },
      getlist(){
        let vm=this
        let params={
          'name':this.name,
          'limit':10,
          'page':this.page
        }
        if(this.witch=='goods'){
          apiActive.fullchoosegoodslist(params).then(res => {
            if(res.cscode==0){
              vm.tableData =res.data.data
              vm.tableData.forEach(x=>x.checked = false)
              vm.total = res.data.count*1
            }
          })
        }
        if(this.witch=='flashsale'){
          apiActive.fullchooseactive(params).then(res => {
            if(res.cscode==0){
              vm.tableDatanew =res.data.data
              vm.tableDatanew.forEach(x=>x.checked = false)
              vm.total = res.data.count*1
            }
          })
        }

      },
      handleCurrentChange(val){
        this.choosetime =val
        this.tableDatanew.forEach(x=>x.checked =false)
        this.tableDatanew[Array.from(this.tableDatanew,x=>x.id).indexOf(val.id)].checked = true
      },
      handleCurrentChangeGoods(val){
        this.choosegoods = val
        this.tableData.forEach(x=>x.checked =false)
        this.tableData[Array.from(this.tableData,x=>x.id).indexOf(val.id)].checked = true
      },
      search(){
        this.getlist()
      },
      changepage(val){
        this.page = val
        this.getlist()
      },
      zhuan(timestamp){
        let timestampa = timestamp *1000;
        let date = new Date(timestampa); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        D = parseInt(D) > 9 ? D : '0' + D;
        h = parseInt(h) > 9 ? h : '0' + h;
        m = parseInt(m) > 9 ? m : '0' + m;
        s = parseInt(s) > 9 ? s : '0' + s;
        return Y+M+D+h+m+s;
      }

    },
    components:{
      editprice
    },
    watch:{
      witch(){
        this.getlist()
      }
    }
  }
</script>

<style scoped>

  .dialog-footer{
    width: 100%;
    height: auto;
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 40px;
  }
</style>
<style>
  .yu{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .el-radio__inner{
    border: 1px solid red;
  }
</style>
