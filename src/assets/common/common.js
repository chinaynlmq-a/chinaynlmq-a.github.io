class Common {
  constructor () {
    this.init();
  }
  init () {
    console.log('我运行了common里面的方法');
  }
}
window.Tools = new Common();
