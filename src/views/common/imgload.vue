<template>
  <div class="imgpubox">
    <div class="addimg_box">
      <div class="img_item" >
        <div v-if="img==''">
          <span  style="font-size: 2.5rem" class="el-icon-plus" ></span>
        </div>
        <div v-if="img !=''">
          <img :src="img" alt="">
        </div>
        <input type="file" class="upload" @change='addsingle(0,$event)'/>
      </div>

    </div>

    <div>{{title}}</div>
  </div>

</template>

<script>
  import * as http from '../../common/http.js'
  import * as config from '../../common/config.js'
  let rootUrl = config.default.apiUrl+"/uploadfile/uploadfile/shop";
  export default {
    props:['title','imgarr'],
    data(){
      return{
        // img:'',
        img:'',
        imgData: {
          accept: 'image/gif, image/jpeg, image/png, image/jpg',
        },
      }
    },
    mounted(){
      this.img = this.imgarr
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
              if (res.cscode == 0) {
                let imgurl = res.data.imgurl
                that.img = imgurl
              } else {
                /!*this.$message.error(data.msg);*!/
              }
            })
            .catch(error => {
              this.$message.error(error);
            });
        }
      },
      getImages( _url ){
        if( _url !== undefined ){
          let _u = _url.substring( 7 );
          return 'https://images.weserv.nl/?url=' + _u;
        }
      },
      delImgs(index){
        this.imgarr.splice(index,1)
        this.$emit('loadimg',this.imgarr)


      }

    },
    computed:{
    },
    watch:{
      img(val){
        this.$emit('loadimg',val)
      },
      imgarr(val){
        this.img = val
      },

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
    display: inline-block;
    width: 150px;
    background-color: #FFFFFF;
    padding-left: .5rem;
    box-sizing: border-box;
    text-align: center;
    line-height:30px;
  }
  .addimg_box{
    display: flex;
    flex-wrap: wrap;
  }

</style>
