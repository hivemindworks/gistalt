var request = require('request')
var baseUrl = 'https://api.github.com/gists'

module.exports = function( accessToken ){
  return {
    gists: function( opts, allGists, callback ){
      this.accessToken = accessToken
      var uri = baseUrl + '?access_token=' + accessToken
      var self = this
      if ( opts.offset && opts.since ){
        uri += '&page='+opts.offset + '&since=' + opts.since
      }
      request({
	uri: uri,
	method: 'GET',
	headers: {
	  'User-Agent': 'gist-pro'
	}
      }, function(err, response, body){
	next = response.headers.link.match(/<(.*)>; rel="next"/);
	gists = JSON.parse( body )
	for( var i = 0, len = gists.length; i < len; i++ ){
	  allGists.push( gists[i] )
	}
        if( next ){
	  next= next[1].split('&page=')[1]
	  self.gists({
	    offset: next, 
	    since: opts.since
	  }, allGists, callback )
	} else{
	  if( callback )
	    callback( allGists )	
	}
      })
    },
    gist: function( id, callback ){
      var uri = baseUrl + "/" + id + '?access_token=' + accessToken
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
	if( callback )
	  callback( JSON.parse(data.gist) )
      })
      return this
    },
    updateGist: function( req, callback ){
      var uri = baseUrl + "/" + req.body.id + '?access_token=' + accessToken
      var data = { files: { } }
      data.files[ req.body.filename ] = { content: req.body.content }
      request({
	uri: uri,
	method: 'PATCH',
	headers: {
	  'User-Agent': 'gist-pro'
	},
	json: data
      }, function(err, response, body){
	if( callback )
	  callback( body )
      })
      return this
    },
    fork: function( req, callback ){
      var uri = baseUrl + "/" + req.body.id + '/forks?access_token=' + accessToken
      request({
	uri: uri,
	method: 'POST',
	headers: {
	  'User-Agent': 'gist-pro'
	}
      }, function(err, response, body){
	if( callback )
	  callback( JSON.parse( body ) )
      })
      return this
    },
    userInfo: function( callback ){
      var uri = 'https://api.github.com/user?access_token=' + accessToken
      request({
	uri: uri,
        method: 'GET',
	headers: {
	  'User-Agent': 'gist-pro'
	}
      }, function( err, response, body ){
	 callback( JSON.parse( body ) )
      })
    }
  }
}
