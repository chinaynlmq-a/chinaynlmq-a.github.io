
// 用于控制 loading 展示的计数变量
let loadNum = 0;
export function showLoading (vueContent) {
  loadNum++;
  vueContent.$loading.show();
}
export function closeLoading (vueContent) {
  loadNum--;
  if (loadNum <= 0) {
    vueContent.$loading.hide(true);
  }
}
