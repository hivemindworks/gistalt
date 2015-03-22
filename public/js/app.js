var textarea = document.querySelector('textarea');

window.onload = autosize;
textarea.addEventListener('keydown', autosize);
             
function autosize(){
  var el = textarea;
  setTimeout(function(){
    el.style.cssText = 'padding:0';
    el.style.cssText = 'height:' + parseInt(el.scrollHeight + 35 )+ 'px';
  },0);
}