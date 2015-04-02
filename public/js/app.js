CodeMirror.fromTextArea(document.getElementById('content'), {
    mode: 'gfm',
    lineWrapping: true,
    theme: "default"
});

var textarea = document.querySelector('.CodeMirror');

window.onload = autosize;
textarea.addEventListener('keydown', autosize);
             
function autosize(){
  var el = textarea;
  setTimeout(function(){
    el.style.cssText = 'padding:0';
    el.style.cssText = 'height:' + parseInt(el.scrollHeight + 35 )+ 'px';
  },0);
}

$('[data-submit]').on('click', function( event ){
  event.preventDefault()
  var $submittee = $($(this).data('submit'))
  $.ajax({
    url: $submittee.attr('action'),
    method: $submittee.attr('method'),
    data: $submittee.serialize(),
    success: function( response ){
      console.log( response )
    }
  })
})
