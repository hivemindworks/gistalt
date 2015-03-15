var request = require('request')
var config = require('./config')
var gists = function( at, cb ){
  return request({
    uri: 'https://api.github.com/gists',
    method: 'GET',
    headers: {
      'User-Agent': 'gist-pro'
    },
    json: {
      access_token: at
    }
  }, function(err, response, body){
    cb(body)
  })
}


module.exports = {
  index: function( req, res ){
    if ( req.session.accessToken ){
      gists( req.session.accessToken, function( body ){
	res.render('index',{ gists: body }) 
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
    request({
      uri: 'https://api.github.com/gists/' + req.params.id,
      method: 'GET',
      headers: {
	'User-Agent': 'gist-pro'
      },
      json: {
	access_token: req.session.accessToken
      }
    }, function(err, response, body){
      console.log( body )
      res.render('show', {gist: body})	
    })
  }
}