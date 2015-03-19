var request = require('request')
var baseUrl = 'https://api.github.com/users/'
var url = function url( user ){
  var baseUrl = 'https://api.github.com/users/'
}

module.exports = function( accessToken ){
  return {
    gists: function( opts, allGists, callback ){
      this.accessToken = accessToken
      var uri, next
      if( opts.user ){
	uri =  baseUrl + opts.user +'/gists?access_token=' + accessToken
      } else {
	uri = baseUrl + '?access_token=' + accessToken
      }
      if( opts.since )
        uri += '&since=' + opts.since
      if ( opts.offset )
        uri += '&page='+opts.offset 
      var self = this
      request({
	uri: uri,
	method: 'GET',
	headers: {
	  'User-Agent': 'gist-pro'
	}
      }, function(err, response, body){
	if( response.headers.link )
	  next = response.headers.link.match(/<(.*)>; rel="next"/)
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
      var uri = ( req.session.user ) + "/" + id + '?access_token=' + accessToken
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
