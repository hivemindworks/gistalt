$('.js-hide').hide()
var Gistalt = Object.create( new ActiveStorage("Gistalt") )
var cm = CodeMirror.fromTextArea(document.getElementById('content'), {
    mode: 'gfm',
    lineWrapping: true,
    theme: "default"
});
var isSaved = function(){
  $("[data-saved]").attr('data-saved', cm.getValue() == g.content && $("[name='description']") == g.description && $("[name='filename']") == g.filename )
}
$("form").on("change", isSaved) 
cm.on("change", isSaved)

var textarea = document.querySelector('.CodeMirror');
var autosize = function autosize(){
  var el = textarea;
  setTimeout(function(){
    el.style.cssText = 'padding:0';
    el.style.cssText = 'height:' + parseInt(el.scrollHeight + 35 )+ 'px';
  },0);
}
var g = Gistalt.findBy({
  gist_id: $("[name='id']").val()
})
if( !g ){
  g = Gistalt.create({
    gist_id: $("[name='id']").val(),
    content: $('#content').html(),
    description: $("[name='description']").val(),
    filename: $("[name='filename']").val()
  })
}else{
  g.content = $('#content').html()
  g.description = $("[name='description']").val()
  g.filename = $("[name='filename']").val()
}

autosize()
textarea.addEventListener('keydown', autosize);

$('form input').on('keypress', function( event ){
  if( event.keyCode == 13 ){
    return false
  }
})

$('[data-submit]').on('click', function( event ){
  $(this).attr('data-saved', true )
  event.preventDefault()
  var $submittee = $($(this).data('submit'))
  cm.save() // update textarea
  g.content = cm.getValue()
  g.save()
  if ( $submittee.attr('action') == "/create" ){
    $submittee.submit()   
  } else {
    $.ajax({
      url: $submittee.attr('action') + '/json',
      method: $submittee.attr('method'),
      data: $submittee.serialize(),
      success: function( response ){
	$('.js-updated-at').html( response.updated_at )
	$('.js-revisions').html( response.history.length )
      }
    })
  }
})
