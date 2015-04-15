var gistalt = (function(){
    var Gistalt = function(){
        this.els = {
            id: document.querySelector('.js-id'),
            save: document.querySelector('.js-save'),
            fork: document.querySelector('.js-fork'),
            delete: document.querySelector('.js-delete'),
            content: document.querySelector('.js-content'),
            filename: document.querySelector('.js-filename'),
            description: document.querySelector('.js-description'),
            publicToggle: document.querySelector('#checkbox-public'),
            renderee: document.querySelector('.js-render-markdown')
        }
        this.init()
    }

    Gistalt.prototype = {
        init: function(){
            $('.js-hide').hide()
            if( this.els.content ){
                this.els.codemirror = CodeMirror.fromTextArea( this.els.content, {
                    mode: 'gfm',
                    lineWrapping: true,
                    theme: "default",
                    autofocus: true
                });
                this.els.codemirror.setCursor({line: 99999999 })
                this.localStorage = Object.create( new ActiveStorage("Gistalt") )
                this.gist = this.localStorage.findBy({
                    gist_id: this.els.id.value
                })
                if( !this.gist ){
                    this.gist = this.localStorage.create({
                        gist_id: this.els.id.value,
                        content: this.els.content.value,
                        description: this.els.description.value,
                        filename: this.els.filename.value
                    })
                }else{
                    this.gist.content = this.els.content.innerHTML
                    this.gist.description = this.els.description.value
                    this.gist.filename = this.els.filename.value
                    this.gist.save()
                }
            }
            if( this.els.renderee )
	      this.els.renderee.innerHTML = marked( this.els.renderee.innerHTML )
            this.bindUI()	  
        },
        bindUI: function(){
            var self = this
            $('.js-show-progress').on('click', function(){
                this.classList.add('is-saving')
            })
            document.body.addEventListener('click', function( event ){
                if( event.target.value == undefined && event.target.href == undefined && !event.target.classList.contains('logo') )
                    gistalt.els.codemirror && gistalt.els.codemirror.focus()
            }, false)
            window.addEventListener('beforeunload', function(e) {
	        try{
		  var saved = gistalt.els.save && gistalt.els.save.getAttribute('data-saved') == "true" || gistalt.els.save.classList.contains('js-skip-alert')
		} catch (e) {
		  var saved = true
		}
                if( !saved )
		  e.returnValue = 'Uh oh, you\'re about to lose some changes!'
            })
	    $(window).keydown(function (e){
	      if (e.metaKey && e.keyCode == 83) {
		gistalt.els.save.classList.add('is-saving')
		gistalt.save( gistalt.els.save )
		e.preventDefault()
		return false
	      }
	    });
            this.els.save && this.els.save.addEventListener('click', function( event ){
                event.preventDefault()
                gistalt.save( event.target )
            })
            this.els.fork && this.els.fork.addEventListener('click', function( event ){
                event.preventDefault()
                gistalt.save( event.target )
            })
            this.els.delete && this.els.delete.addEventListener('click', function( event ){
                event.preventDefault()
                gistalt.save( event.target )
            })
            this.els.publicToggle && this.els.publicToggle.addEventListener('click', function( event ){
                event.target.attr('checked', event.target.checked)
            })
            this.els.filename && this.els.filename.addEventListener('keypress', this.preventFormSubmit, false)
            this.els.description && this.els.description.addEventListener('keypress', this.preventFormSubmit, false)
            this.els.codemirror && this.els.codemirror.on('change', function(){
                gistalt.isSaved.call( self )
            })
            if( this.els.save && !this.els.save.classList.contains('js-create') )
                this.autoSave()
        },
        autoSave: function(){
            var typingTimer
            var doneTypingInterval = 5000
            var doneTyping = function doneTyping(){
                gistalt.save( gistalt.els.save )
            }
            var isTyping = function isTyping( event ){
                clearTimeout(typingTimer)
                typingTimer = setTimeout(doneTyping, doneTypingInterval)
            }
            this.els.codemirror && this.els.codemirror.on("change", isTyping)
            this.els.description.addEventListener("keypress", isTyping)
            this.els.filename.addEventListener("keypress", isTyping)
        },
        preventFormSubmit: function( event ){
            gistalt.isSaved( event.target )
            if( event.keyCode == 13 ){
                return false
            }
        },
        isSaved: function(){
	    var isSaved = this.els.codemirror.getValue() == this.gist.content && this.els.description == this.els.description && this.els.filename == this.gist.filename 
            $(this.els.save).attr('data-saved', isSaved )
	    gistalt.els.save.innerHTML = isSaved ? "Saved" : "Save"
        },
        save: function( callee ){
            var $submittee = $($(callee).data('submit'))
            gistalt.els.codemirror.save() // update textarea
            gistalt.gist.description = gistalt.els.description.value
            gistalt.gist.filename = gistalt.els.filename.value
            gistalt.gist.save()

            if ( $submittee.attr('action') == "/create" ){
                if ( gistalt.els.codemirror.getValue() != "" ){
                    $submittee.submit()   
                }
            } else if ( $submittee.attr('action') == "/fork" ){
	      $submittee.submit()   
            } else if( $submittee.attr('action') == "/delete" ){
                $submittee.submit()   
            } else {
                $.ajax({
                    url: $submittee.attr('action') + '/json',
                    method: $submittee.attr('method'),
                    data: $submittee.serialize(),
                    success: function( response ){
                        $('.js-updated-at').html( response.updated_at )
		        gistalt.els.save.innerHTML = "Saved"
                        if( response.history )
                            $('.js-revisions').html( response.history.length )
                        $(callee).attr('data-saved', true)
                        callee.classList.remove('is-saving')
                    }
                })
            }
        }
    }
    return new Gistalt()
})()


