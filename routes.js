var request = require('request')
var config = require('./config')
var github = require('./github')

module.exports = {
  index: function( req, res ){
    if ( req.session.accessToken ){
      var offset = req.query.p
      github( req.session.accessToken ).gists( offset, function( body, prev, next ){
	res.render('index',{ 
	  gists: JSON.parse(body),
	  prev: prev,
	  next: next
	}) 
      })
    } else {
      res.render('index')	 
    }
  },
  login: function( req, res){
      req.session.redirect = req.get('Referrer')
      res.redirect('https://github.com/login/oauth/authorize?redirect_uri='+config.callback_uri + '+&scope=gist&client_id='+config.client_id)
  },
  callback: function( req, res ){
    request({
      uri: 'https://github.com/login/oauth/access_token',
      method: 'POST',
      json: {
	code: req.query.code,
	client_id: config.client_id,
	client_secret: config.client_secret
      }
    }, function(err, response, body){
      req.session.accessToken = body.access_token
      github( req.session.accessToken ).userInfo( function( user ){
	req.session.currentUser = user
        res.redirect( req.session.redirect ) 
      })
    })
  },
  logout: function( req, res ){
    req.session.destroy()
    res.redirect('/')
  },
  show: function( req, res ){
    github( req.session.accessToken ).gist( req.params.id, function( body ){
      res.render('show', {gist: body} ) 
    })
  },
  showFile: function( req, res ){
    if( req.session.accessToken ){
      github( req.session.accessToken ).gist( req.params.id, function( gist ){
	  var owner = gist.owner.login == req.session.currentUser.login
	  res.render('showFile', { 
	    content: gist.files[req.params.filename].content,
	    owner: owner,
	    gist: gist,
	    filename: req.params.filename
	  }) 
      })
    } else {
      res.render('showFile', {
        owner: false,
	gist: { id: req.params.id },
	filename: req.params.filename
      })
    }
  },
  fork: function( req, res ){
    github( req.session.accessToken ).fork( req, function( gist ){
      res.redirect('/' + gist.id + '/' + req.body.filename )
    });
  },
  updateFile: function( req, res ){
    github( req.session.accessToken ).updateGist( req, function( gist ){
      res.redirect('/' + gist.id + '/' + req.body.filename )
    });
  }
}