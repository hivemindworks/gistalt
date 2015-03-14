var request = require('request')
var baseUrl = 'https://api.github.com/gists'

module.exports = function( accessToken ){
  return {
    gists: function( callback ){
      var uri = baseUrl + '?access_token=' + accessToken
	console.log(uri)
      request({
	uri: uri,
	method: 'GET',
	headers: {
	  'User-Agent': 'gist-pro'
	}
      }, function(err, response, body){
	callback( body )
      })
    },
    gist: function( id, callback ){
      var uri = baseUrl + "/" + id + '?access_token=' + accessToken
      console.log( uri )
      request({
	uri: uri,
	method: 'GET',
	headers: {
	  'User-Agent': 'gist-pro'
	}
      }, function(err, response, body){
	var data = {
	  gist: body
	}
	if( accessToken )
	  data.loggedIn = true
	callback( JSON.parse(data.gist) )
      })
      return this
    },
    file: function( filename ){
      var uri = baseUrl + req.params.id + '?access_token=' + req.session.accessToken
      request({
	uri: uri,
	method: 'GET',
	headers: {
	  'User-Agent': 'gist-pro'
	}
      }, function(err, response, body){
	var data = {
	  gist: JSON.parse(body)
	}
	if( req.session.accessToken )
	  data.loggedIn = true
      })
      return this
    }
  }
}
