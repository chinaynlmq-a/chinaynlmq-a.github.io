class Common {
  constructor () {
    this.init();
  }
  init () {
    // !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/)
    console.log('我运行了common里面的方法');
  }
}
window.Tools = new Common();
