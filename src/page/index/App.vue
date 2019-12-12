<template>
  <div id="dy">
    <headers></headers>
     <!-- <div class="advertisement">
        <div class="container">
          <div class="adv"></div>
       </div>
       </div>  -->
       <Advertis>
         <div class="adv"></div>
       </Advertis> 
     <div class="container">
       <div class="row">
        <LeftBodys>
          <div class="articlelist">
             <h3></h3>
          </div>
          <div class="articlelist">sss</div>
        </LeftBodys>
        <div class="right-side">
          <div class="card-body">
              <AboutMe></AboutMe>
          </div>
        </div>
       </div>
     </div>
     <Footers></Footers>
  </div>
</template>

<script>
import { headers, Advertis, AboutMe, Footers, LeftBodys } from '../../components/index';
export default {
  data () {
    return {};
  },
  components: {
    headers,
    AboutMe,
    Advertis,
    Footers,
    LeftBodys
  },
  created: function () {
  },
  methods: {
  },
  mounted: function () {
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>
