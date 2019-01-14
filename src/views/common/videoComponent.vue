<template>
  <div class="imgpubox">
    <div class="addimg_box">
      <div class="img_item" v-for="(item,index) in  videoarrs">
        <em class="el-icon-close" @click="delImgs(index)" ></em>
        <!--<img :src="item" alt="">-->
        <video :src="item" style="width: 8.5rem!important;
    height: 6.67rem!important;"></video>
      </div>
      <div class="img_item" v-if="videoarr.length<videonum">
        <div>
          <span style="font-size: 2.5rem" class="el-icon-plus" ></span>
          <em>{{videotitle}}</em>
        </div>
        <input type="file" class="upload" @change='qiniuUpload(0,$event)'/>
      </div>
    </div>
  </div>
</template>

<script>
  import * as http from '../../common/http.js'
    export default {
      props:['videonum','videotitle','videoarr'],
        name: "videoComponent",
      data(){
        return {
          videoarrs:[],
          vidata:{
            accept:'video/wmv,video/avi,video/dat,video/asfReal ,video/rm ,video/rmvb, video/ramMPEG,video/mpg, video/mpeg, video/3gpApple, video/movSony, video/mp4, video/m4vDV, video/dvix, video/dv, video/dat, video/mkv, video/flv, video/vob, video/ram, video/qt, video/divx, video/cpk, video/fli, video/flc, video/mod'
          },
        }
      },
      mounted(){
        console.log('--------------loadmore------------------------')
        console.log(this.videoarr)
        if(this.videoarr){
          this.videoarrs = JSON.parse(JSON.stringify(this.videoarr))
        }else {
          this.videoarr==[]
        }
      },
      methods: {
        qiniuUpload(num,event) {
          var _this = this;
          console.log(event);
          // var code = 'shop';
          var file = event.target.files[0];
          let type = file.type;//文件的类型，判断是否是视频??????????????
          let size = file.size;//文件的大小，判断视频的大小????????????
          console.log(file);
          if (_this.vidata.accept.indexOf(type) == -1) {
            alert('请选择我们支持的视频格式！');
            return false;
          } else if (size > 206399000) {
            alert('请选择200M以内的视频！');
            return false;
          } else {
            const tokenUrl = 'https://api.zhisoufangdichan.com/api/v1/upload/uploadVideo/video';
            let form = new FormData();
            form.append('video', file);
            // form.append("shop_code", code); //传其他参数
            http.uplodPicvideo(file, tokenUrl, '', '')
              .then(res => {
                console.log(res);
                // let data = res.data;
                if (res.cscode == 0) {

                  this.$message(res.data.msg);
                  this.videoarrs.push(res.data.imgurl);
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch(error => {
                this.$message.error(error);
              });
          }
        },
        delImgs(index){
          console.log(index);
          this.videoarrs.splice(index,1)
          this.$emit('loadimgs',this.videoarr)
        }
      },
      watch:{
        videoarrs(val){
          console.log(val);
          this.$emit('loadimgs',val)
        },
        videoarr(val){
          console.log(val)
          if(val && typeof val == 'string'){
            this.videoarrs = JSON.parse(val)
          }else if(val){
            this.videoarr = val
          }


        }
      }
    }
</script>

<style scoped>
  .myicon{width: 40px;cursor: pointer;}
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
