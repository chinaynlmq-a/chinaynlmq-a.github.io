
import '@babel/polyfill';
import Vue from 'vue';
import '@/assets/common/common.js';
import '@/assets/common/flexible.js';

const setup = mixins => {
  return new Vue({
    el: '#app',
    template: '<App/>',
    mixins: [...mixins]
  });
};

export default setup;
