<template>
<div class="advertisement">
  <div class="container">
    <!-- <div class="adv"></div> -->
    <slot></slot>
  </div>
</div> 
</template>
<script>
export default {
  name: 'Advertis',
  data () {
    return {};
  },
  methods: {
    
  }
};
</script>
<style  lang='less'>
.advertisement{
  background: #fff;
  height: 136/@px2rem;
  margin-bottom: 50/@px2rem;
  overflow: hidden;
}
</style>
