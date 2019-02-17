import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})

import './assets/scss/catalog.scss';

//메뉴 열기닫기
var sidebarController = document.querySelector('.btn-fold');
var sidebarPanel =  document.querySelector('.section-sidebar');
sidebarController.addEventListener('click',function(){
  sidebarPanel.classList.toggle("side__close");
})
