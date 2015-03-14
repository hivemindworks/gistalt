var request = require('request')
var config = require('./config')
var gists = function( at, cb ){
  request({
    uri: 'https://api.github.com/gists?access_token=' + at,
    method: 'GET',
    headers: {
      'User-Agent': 'gist-pro'
    }
  }, function(err, response, body){
    cb(body)
  })
}


module.exports = {
  index: function( req, res ){
    if ( req.session.accessToken ){
      gists( req.session.accessToken, function( body ){
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
  show: function( req, res ){
    console.log( req.session.accessToken )
    var uri = 'https://api.github.com/gists/' + req.params.id + '?access_token=' + req.session.accessToken
    console.log( uri )
    request({
      uri: uri,
      method: 'GET',
      headers: {
	'User-Agent': 'gist-pro'
      }
    }, function(err, response, body){
      console.log( JSON.parse(body)['id'] )
      console.log("**********")
      var data = {
        gist: JSON.parse(body)
      }
      if( req.session.accessToken )
        data.loggedIn = true
      res.render('show', data)	
    })
  }
}