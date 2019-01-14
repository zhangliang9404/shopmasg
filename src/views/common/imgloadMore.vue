<template>
    <div class="imgpubox">
      <div class="addimg_box">
        <div class="img_item" v-for="(item,index) in  newarr">
          <em class="el-icon-close" @click="delImgs(index)" ></em>
          <img :src="item" alt="">
        </div>
        <div class="img_item" v-if="newarr.length<imgnum">
           <div>
             <span style="font-size: 2.5rem" class="el-icon-plus" ></span>
             <em>{{title}}</em>
           </div>
          <input type="file" class="upload" @change='addsingle(0,$event)'/>
        </div>
      </div>
    </div>
</template>

<script>
  import * as http from '../../common/http.js'
  import * as config from '../../common/config.js'
  let rootUrl = config.default.apiUrl+"/uploadfile/uploadfile/shop";
    export default {
      props:['imgnum','title','imgarr'],
      data(){
        return{
          img:'',
          newarr:[],
          imgData: {
            accept: 'image/gif, image/jpeg, image/png, image/jpg',
          }
        }
      },
      mounted(){
        console.log('--------------loadmore------------------------')
        console.log(this.imgarr)
        if(this.imgarr){
          this.newarr = JSON.parse(JSON.stringify(this.imgarr))
        }else {
          this.imgarr==[]
        }
      },
      methods:{
        addsingle(num,event) {
          let that =this
          var code = 'shop';
          let reader = new FileReader();
          let file = event.target.files[0];
          let type = file.type;//文件的类型，判断是否是图片??????????????
          let size = file.size;//文件的大小，判断图片的大小????????????
          if (this.imgData.accept.indexOf(type) == -1) {
            alert('请选择我们支持的图片格式！');
            return false;
          } else if (size > 10485760) {
            alert('请选择10M以内的图片！');
            return false;
          } else {
            var url = rootUrl;
            let form = new FormData();
            form.append('file_name', file);
            form.append("shop_code", code); //传其他参数
            http.uplodPic(file, url, '', '')
              .then(res => {
                let data = res.data;
                if (res.cscode == 0) {
                  let imgurl = data.imgurl
                  that.newarr.push(imgurl)
                }
              })
              .catch(error => {
                this.$message.error(error);
              });
          }
        },
        delImgs(index){
          this.newarr.splice(index,1)
          this.$emit('loadimg',this.imgarr)
        }

      },
      watch:{
        newarr(val){
          this.$emit('loadimg',val)
        },
        imgarr(val){
          if(val && typeof val == 'string'){
            this.newarr = JSON.parse(val)
          }else if(val){
            this.newarr = val
          }


        }
      }

    }
</script>

<style scoped>

.img_item{
  width: 8.5rem;
  height: 7.67rem;
  border: 1px dashed #cfcfcf;
  justify-content: center;
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
  margin-left: 1rem;
  margin-top: .5rem;
}

  em{
    display: block;
    font-style: normal;
    font-size: 1rem;
    color: #878787;
  }
  .upload{
    display: block;
    width: 8.5rem!important;
    height: 6.67rem!important;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
  .el-icon-close{
    font-style: normal;
    position: absolute;
    top: 0.2rem;
    right: .1rem;
  }
  .img_item img{
    width: 90%;
    height: 5.67rem;
    display: block;
    margin: 0.5rem auto;
    padding: 0;
  }
  .imgpubox{
    background-color: #FFFFFF;
    padding-left: .5rem;
    box-sizing: border-box;
  }
  .addimg_box{
    display: flex;
    flex-wrap: wrap;

  }

</style>
