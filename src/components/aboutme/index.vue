<template>
 <div class="aboutme">
   <div class="weixin-bg"></div>
   <div class="wx-txt">咨询扫一扫</div>
   <div class="wx-txt">微信：chinaynlmq-a</div>
</div>
</template>
<script>
export default {
  name: 'AboutMe',
  data () {
    return {};
  },
  methods: {
    
  }
};
</script>
<style scoped lang='less'>
   .aboutme{
     .weixin-bg{
       background: url('./weixin.jpg');
       height: 1000/@px2rem;
       background-size:100% 100%;
     }
   }
</style>
