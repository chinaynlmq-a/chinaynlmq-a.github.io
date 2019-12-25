<template>
 <div class="header">
       <nav class="container">
           <div class="logo"></div>
           <a href="/index.html">首页</a>
           <a href="/dy/index.html">博文</a>
       </nav>
     </div>
</template>
<script>
export default {
  name: 'headers',
  data () {
    return {};
  },
  methods: {
    
  }
};
</script>
<style  lang='less'>
.header{
  height: 90/@px2rem;
  overflow: hidden;
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  box-shadow: 0 1px 1px rgba(0,0,0,.03);
  padding-top: 9/@px2rem;
  .logo{
    width: 76/@px2rem;
    height: 76/@px2rem;
    background: url('./logo.jpeg') 0 0 no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    vertical-align: middle;
  }
  a{
    display: inline-block;
    padding: 0 20/@px2rem;
    color: #000;
    font-size: 24/@px2rem;
  }
}
</style>
