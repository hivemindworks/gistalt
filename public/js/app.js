var cm = CodeMirror.fromTextArea(document.getElementById('content'), {
    mode: 'gfm',
    lineWrapping: true,
    theme: "default"
});

var isDirty = function(){
  $("[data-saved]").attr('data-saved', cm.getValue() == g.content )
}

cm.on("change", function( cm ){
})

var textarea = document.querySelector('.CodeMirror');

window.onload = autosize;
textarea.addEventListener('keydown', autosize);
Gistalt = Object.create( new ActiveStorage("Gistalt") )
var g = Gistalt.findBy({
  gist_id: $("[name='id']").val()
})
if( !g ){
  Gistalt.create({
    gist_id: $("[name='id']").val(),
    content: $('#content').html()
  })
}
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
  g.content = cm.getValue()
  $.ajax({
    url: $submittee.attr('action') + '/json',
    method: $submittee.attr('method'),
    data: $submittee.serialize(),
    success: function( response ){
      $('.js-updated-at').html( response.updated_at )
    }
  })
})
