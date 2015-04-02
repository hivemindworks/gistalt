var cm = CodeMirror.fromTextArea(document.getElementById('content'), {
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

$('.js-hide').hide()
$('[data-submit]').on('click', function( event ){
  event.preventDefault()
  var $submittee = $($(this).data('submit'))
  cm.save() // update textarea
  $.ajax({
    url: $submittee.attr('action') + '/json',
    method: $submittee.attr('method'),
    data: $submittee.serialize(),
    success: function( response ){
      $('.js-updated-at').html( response.updated_at )
    }
  })
})
