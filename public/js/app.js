var textarea = document.querySelector('textarea');

textarea.addEventListener('keydown', autosize);
window.onload = autosize;
             
function autosize(){
  var el = textarea;
  setTimeout(function(){
    el.style.cssText = 'height:auto; padding:0';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  },0);
}