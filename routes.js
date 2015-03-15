var request = require('request')
var config = require('./config')
var github = require('./github')

module.exports = {
  index: function( req, res ){
    if ( req.session.accessToken ){
      github( req.session.accessToken ).gists( function( body ){
	res.render('index',{ gists: JSON.parse(body) }) 
      })
    } else {
      res.render('index')	 
    }
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
      res.redirect('/')
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
	  res.render('showFile', { 
	    content: gist.files[req.params.filename].content,
	    gist: gist,
	    filename: req.params.filename
	  }) 
      })
    } else {
      res.render('showFile', {
        clientFetch: true,
	gist: { id: req.params.id },
	filename: req.params.filename
      })
    }
  },
  updateFile: function( req, res ){
    github( req.session.accessToken ).updateGist( req, function( gist ){
      res.redirect('/' + gist.id + '/' + req.body.filename )
    });
  }
}