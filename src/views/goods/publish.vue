
<template>
  <!-- upload -->
  <div style="margin:0 20px;">
    <a href="javascript:;" class="a-upload">
      <input type="file" class="videoBtn" id="selectVideo" @change="qiniuUpload"  accept="video/*" capture="user">
      开始录制视频
    </a>
  </div>
</template>
<script>
  //引入组件
  // import InputTag from 'vue-input-tag';
  import  Qiniu from 'qiniu-js'
  import * as http from '../../common/http.js'
  export default{
    data(){
      return {
        vidata:{
          accept:'video/wmv,video/avi,video/dat,video/asfReal ,video/rm ,video/rmvb, video/ramMPEG,video/mpg, video/mpeg, video/3gpApple, video/movSony, video/mp4, video/m4vDV, video/dvix, video/dv, video/dat, video/mkv, video/flv, video/vob, video/ram, video/qt, video/divx, video/cpk, video/fli, video/flc, video/mod'
        },
      }
    },
    methods: {
      qiniuUpload(event) {
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
          // debugger
          const tokenUrl = 'https://api.zhisoufangdichan.com/api/v1/upload/uploadVideo/video';
          let form = new FormData();
          form.append('file_name', file);
          // form.append("shop_code", code); //传其他参数
          http.uplodPic(file, tokenUrl, '', '')
            .then(res => {
              console.log(res);
              // let data = res.data;
              // if (res.cscode == 0) {
              //   imgN++;
              //   this.$message(data.msg);
              //   this.newArrImgs.push(data.imgurl);
              // } else {
              //   this.$message.error(data.msg);
              // }
            })
            .catch(error => {
              this.$message.error(error);
            });
        }
      }
    }
  }
</script>

<style>
  .myicon{width: 40px;cursor: pointer;}
</style>
