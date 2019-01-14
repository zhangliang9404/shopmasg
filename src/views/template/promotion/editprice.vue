<template>
    <div style="position: relative;padding-bottom: 50px">
      <el-table
        :data="iteminfo"
        border
        style="width: 100%">
        <el-table-column
          prop="sku_font"
          label="规格"
          width="180">
        </el-table-column>
        <el-table-column
          prop="market_price"
          label="市场价"
          width="180">
        </el-table-column>
        <el-table-column
          prop="cost_price"
          label="原价">
        </el-table-column>
        <el-table-column
          prop="group_price"
          label="团购价">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="单买价">
        </el-table-column>
        <el-table-column
          prop="flashsale_gprice"
          label="限时团购价">
          <template slot-scope="scope">
            <el-input type="number" @blur="flashsale_gprice(scope.row.flashsale_gprice,scope.$index)" v-model="scope.row.flashsale_gprice" placeholder="请输入限时团购价"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="flashsale_price"
          label="限时单买价">
          <template slot-scope="scope">
            <el-input type="number" @blur="flashsale_price(scope.row.flashsale_price,scope.$index)" v-model="scope.row.flashsale_price" placeholder="请输入限时团购价"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save">保存</el-button>
      </span>
    </div>
</template>

<script>
  import { api_active } from '@/api/api';
  import editprice from  '@/views/template/promotion/editprice'
  let apiActive = new api_active();
    export default {
        props:['iteminfo'],
        name: "editprice",
        methods:{
          save(){
            let vm =this
            this.iteminfo.forEach(function (item) {
              item.sku_id=item.id
              delete item.id
              delete item.cost_price
              delete item.sku_font
              delete item.market_price
              delete item.group_price
              delete item.goods_price
            })
            let params={
              op:'change_price',
              sku:this.iteminfo
            }
            apiActive.goodschange(params).then(res => {
              if(res.cscode==0){
                vm.$message.success(res.data.msg)
                vm.$emit('save')
              }else {
                vm.$message.error(res.data.msg)
              }
            })




          },
          flashsale_gprice(price,index){
            if(Number(price)>Number(this.iteminfo[index].group_price)){
              this.$message.error('限时团购价需小于团购价')
              this.iteminfo[index].flashsale_gprice=null
            }

          },
          flashsale_price(price,index){
            if(Number(price)>Number(this.iteminfo[index].goods_price)){
              this.$message.error('限时单买价需小于单买价')
              this.iteminfo[index].flashsale_price=null
            }
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
