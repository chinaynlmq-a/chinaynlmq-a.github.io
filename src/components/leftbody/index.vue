<template>
 <div class="left-body">
  <slot></slot>          
</div>
</template>
<script>
export default {
  name: 'LeftBodys',
  data () {
    return {};
  },
  methods: {
    
  }
};
</script>
<style  lang='less'>
.left-body{
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
  min-width: 100%;
  // flex: 0 0 100%;
  width: 0;
  min-width: 0;
}
</style>
