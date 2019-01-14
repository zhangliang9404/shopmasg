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
          prop="goods_name"
          label="商品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="规格//团购价/单买价（元）"
          width="180">
          <template slot-scope="scope">
            <div class="template_content">
              <el-tooltip v-for="(skuitem,index) in scope.row.sku_info" :key="index" class="item" effect="dark" :content="skuitem" placement="top">
                <p  class="yu">{{skuitem}}</p>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="规格限时团购价">
          <template slot-scope="scope">
            <div class="template_content">
              <el-tooltip v-for="(skuitem,index) in scope.row.flashsale_gprice" :key="index" class="item" effect="dark" :content="skuitem" placement="top">
                <p  class="yu">{{skuitem}}</p>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          width="180"
          label="规格限时单买价">
          <template slot-scope="scope">
            <div class="template_content">
              <el-tooltip v-for="(skuitem,index) in scope.row.flashsale_price" :key="index" class="item" effect="dark" :content="skuitem" placement="top">
                <p class="yu">{{skuitem}}</p>
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
            <el-button  @click="changeprice(scope.row)">价格</el-button>
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
        </el-table-column>
        <el-table-column
          prop="flashsale_end"
          label="结束时间">
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
        suregoods(){
         let arr =  this.choosegoods.flashsale_gprice.concat(this.choosegoods.flashsale_price)
          var flg = false
          arr.forEach(x=>{
            let y = x.split('￥')
            if(!y[1] || y[1]<=0){
              flg = true
            }
          })
         if(flg==true){
           this.$message.error('请填写完整限时价格')
           return
         }
          this.$emit('surewhat',{'choosegoods':this.choosegoods})
        },
        suretime(){
          this.$emit('surewhat',{'choosetime':this.choosetime})
        },
        save(){
          this.pricemodel = false
          this.getlist()
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
          this.witch=='goods'?params.op='goods':params.op='flashsale'
          apiActive.getgoodsoplist(params).then(res => {
            if(res.cscode==0){
              if(vm.witch=='goods'){
                vm.tableData =Object.values( res.data.info)
                vm.tableData.forEach(x=>x.checked = false)
                vm.total = res.data.count*1
              }else {
                vm.tableDatanew =Object.values( res.data.info)
                vm.tableDatanew.forEach(x=>x.checked = false)
                vm.total = res.data.count*1
              }

            }
          })
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
