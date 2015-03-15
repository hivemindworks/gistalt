var request = require('request')
var baseUrl = 'https://api.github.com/gists'

module.exports = function( accessToken ){
  return {
    gists: function( callback ){
      this.accessToken = accessToken
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
      var self = this
      request({
	uri: uri,
	method: 'GET',
	headers: {
	  'User-Agent': 'gist-pro'
	}
      }, function(err, response, body){
	self.files = JSON.parse(body)["files"]
	var data = {
	  gist: body
	}
	if( accessToken )
	  data.loggedIn = true
	if( callback )
	  callback( JSON.parse(data.gist) )
      })
      self.id = id
      return self
    },
    file: function( filename, callback ){
      console.log( this.files )	  
      callback( )
    }
  }
}
