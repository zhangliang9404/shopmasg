<template>
  <div class="area">
    <!--action 上传的地址-->
    <!--before-upload 上传之前的验证-->
    <!--multiple 是否支持多选-->
    <!--limit 最大允许上传个数-->
    <!--list-type="picture-card" 文件列表的类型正方形显示-->
    <!--:on-preview="handlePictureCardPreview" 点击文件列表中已上传的文件时的钩子-->
    <!--on-exceed="handleExceed" 文件超出个数限制时的钩子-->

    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      :before-upload="onBeforeUpload"
      multiple
      :limit="3"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-exceed="handleExceed">
      <el-button size="small" type="primary">上传视频</el-button>
      <div slot="tip" class="el-upload__tip">请保证视频格式正确，且不超过10M！</div>
    </el-upload>

    <div id="node">
      <div class='container' :class="fold ? 'fold' : 'unfold'">
        {{ content }}</div>
      <span @click='handleFold' v-show="fold">展开→</span>
      <span @click='handleFold' v-show="!fold">←收起</span>
    </div>


  </div>
</template>


<script>
  export default {

    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        content: "",
        fold : true

      }
    },
    methods: {
      handleFold() {
        this.fold = !this.fold;
      },
      getData: function() {
        setTimeout(() => {
          this.content =
            "前世的魏无羡万人唾骂，声名狼藉。呕心沥血护持师弟，师弟带人端了他老巢，亲自送他下地，纵横一世，死无全尸。被镇压数年，曾兴风作浪的一代魔道祖师，重生成了一个……脑残。还特么是个人人喊打的断袖脑残！我见诸君多有病，料诸君见我应如是。他决定敬业地做好一名脑残。但修鬼道不修仙，任你千军万马，十方恶霸，九州奇侠，高岭之花，但凡化为一抔黄土，统统收归旗下，为我所用，供我驱策！主线打怪搅基带孩子，日常撒泼发疯耍赖扮猪吃老虎。不走复仇流，拒绝苦大仇深，但是该虐的渣渣还是会虐的。";
        }, 1000);
      },

      //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      onBeforeUpload(file){
        const isLt10M = file.size / 1024 / 1024  < 10;
        // const isVIDEO = file.type === 'video/mp4'|| 'video/ogg'|| 'video/flv'||'video/avi'||'video/wmv'||'video/rmvb';
        if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) === -1) {
          this.$message.error('请上传正确的视频格式');
          return false;
        }
        if (!isLt10M) {
          this.$message.error('上传视频大小不能超过10MB哦!');
          return false;
        }

      },
      //文件超出个数限制时的钩子
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    },
    mounted() {
      this.getData();
    },
  }
</script>

<style>
  .container {
    width : 200px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .container.fold {
    -webkit-line-clamp: 3;
  }

  .container.unfold {
    -webkit-line-clamp: 100;
  }
</style>

