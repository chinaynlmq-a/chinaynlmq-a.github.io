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
     <div class="chirld-nav">
       <div class="container">
          <a href="/index.html">首页</a>
          <span>>></span>
          <span>博文</span> 
       </div>
      </div>  
     <div class="container">
       <div class="row">
        <LeftBodys>
          <article>
            <div class="article-title">消费者行为分析-笔记</div>
            <div class="article-title-sub">
            </div>
            <p>消费者行为理论也称为效用理论，它是研究一定在收入和价格条件下，消费者为获得最大满足对各种商品作出的选择方式，即考察消费者选择和消费者行为的基本原则；通常有两种方法进行分析：一种是以基数效用论为基础的边际效用分析，另一种是以序数效用论为基础的无差异曲线分析；</p>
            <h4>1.效用：</h4>
            <p>商品或者服务满足人们某种欲望的能力，或者消费者在消费商品或者服务时所感受的满足程度。定义没有客观标准；</p>
            <h4>2.基数效用论</h4>
            <p>认为效用是可以直接度量的，存在绝对的效用量大小；如用大小1,2,3来表示；</p>
            <h4>3.序数效用论</h4>
            <p>认为效用是一种主观的心里感觉，不可以计量并加总求和，只能用满足度和顺序；<span class="txt-red"><b> chinaynlmq-a</b></span></p>
            <h4>4.边际效用分析法</h4>
            <p>分为总效用和边际效用。总效用和边际效用之间的关系解说：边际效用向正方向，总效用总是处于递增状态；当边际效用为0是。总效用达到最大；当边际效用为负数的时候，总效用处于递减状态；</p>
            <h4> 5.边际效用递减规律：</h4>
            <p>是指在一定时间内,在其他商品的消费数量保持不变的条件下,随着消费者对某种商品消费的增加,消费者从该商品连续增加的每一消费单位中所得到效用增量即边际效用是递减的.</p>
            <p> 边际效用存在的原因:1,由于生理或者心理的原因。人的欲望有两条规律:一是欲望强度递减规律即在一定时期内, 一个人对某种物品的欲望度随着物品数量的增加而减少;二是享受递减规律，即随着欲望的满足，人们得到的满足是递减的;2,物品本身的用途多种多样;</p>
            <h4>6.无差异曲线：</h4>
            <p>也称等效曲线，它是一条表示能过给消费者带来相同满足程度的两种或者两组不同商品的所有组合曲线；表明消费者满足程度无差异、偏好无差异；</p>
            <p>边际商品替代率递减规律：在维持效用水平不变的前提下，随着一种商品的消费数量的连续增加，消费者为得到一单位的这种商品所需要放弃的另一种商品的消费量是递减的；</p>
            <h4>7、预算约束线：</h4>
            <p>又称消费可能线、消费约束线或者支出线；表示消费者在收入和商品的价格给定的条件下，用全部收入所能购买的两种商品的不同数量的组合；</p>
            <h4>8.消费者均衡：</h4>
            <p>消费者在货币收入和商品价格既定的前提下，通过理性的购买和消费各种商品实现的总效用的最大会过程；</p>
          </article>
        </LeftBodys>
        <div class="right-side">
          <div class="card-body">
              <AboutMe></AboutMe>
          </div>
          <div class="card-body">
            <ul>
              <li>抖音蓝v代理商，代理需要钱吗?</li>
              <li>抖音蓝v代理商，代理需要钱吗?</li>
            </ul>
          </div>
          
        </div>
       </div>
     </div>
     <Footers></Footers>
  </div>
</template>

<script>
import { headers, Advertis, AboutMe, Footers, LeftBodys } from '../../../components/index';
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
