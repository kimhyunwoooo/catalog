import './assets/scss/catalog.scss';

import Vue from 'vue'
import App from './App.vue'
import 'expose-loader?$!expose-loader?jQuery!jquery'

new Vue({
  el: '#app',
  render: h => h(App)
})


//메뉴 열기닫기
var sidebarController = document.querySelector('.btn-fold');
var sidebarPanel =  document.querySelector('.section-sidebar');
sidebarController.addEventListener('click',function(){
  sidebarPanel.classList.toggle("side__close");
})


// GNB Bar 애니메이션
$('.list-tab>li').on('mouseenter', function() {
  var menuIndex = $(this).index();
  var menuNum = $('.list-tab>li:eq('+menuIndex+') .link-tab');
  var menuWid = parseInt( menuNum.outerWidth() );
  var menuPos = parseInt( menuNum.position().left);
  $('.bar_menu').stop().animate({
    left : menuPos + parseInt((menuWid/2))
  },200);
  $('.inner_bar').stop().animate({
    width : menuWid+3,
    marginLeft : -(menuWid/2)
  },400);
});
