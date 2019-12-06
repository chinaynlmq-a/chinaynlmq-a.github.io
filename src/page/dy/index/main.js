import setup from '@/assets/common/page-setup/';
import App from './App.vue';
import FastClick from 'fastclick';
FastClick.attach(document.body);
const myMixin = {
  components: { App }
};
setup([myMixin]);