var request = require('request')
var baseUrl = 'https://api.github.com/gists'
var _ = require('lodash')

module.exports = function( accessToken ){
  return {
    gists: function( offset, callback ){
      this.accessToken = accessToken
      var uri = baseUrl + '?access_token=' + accessToken
      if (offset){
        uri += '&page='+offset
      }
      request({
	uri: uri,
	method: 'GET',
	headers: {
	  'User-Agent': 'gist-pro'
	}
      }, function(err, response, body){
	try{
	  next = response.headers.link.match(/<(.*)>; rel="next"/);
	  if( next ){
	    next= next[1].split('&page=')[1]
	  }
	} catch (e) {
          next = undefined
	}
	try{
	  prev = response.headers.link.match(/<(.*)>; rel="prev"/);
	  prev = prev[1].split(',')[3]
	  prev = prev.split('&page=')[1] 
	} catch ( e ){
	  prev = offset - 1
	}
	gists = _.sortBy( JSON.parse(body), function( gist ){
	  return gist.updated_at
	}).reverse()
	callback( JSON.stringify(gists), prev, next )
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
      var data = { files: { }, description: req.body.description }
      data.files[ req.body.oldFilename ] = { 
	content: req.body.content, 
	filename: req.body.filename
      }
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
    createGist: function( req, callback ){
      var uri = baseUrl + '?access_token=' + accessToken
      var data = { 
	files: {},
	"public": req.body.isPublic == "on" ? true : false,
        description: req.body.description || "A gistalt piece"
      }
      var content = req.body.content == "" ? "# " + req.body.filename : req.body.content
      data.files[ req.body.filename ] = { content: content }
      request({
	uri: uri,
	method: 'POST',
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
  },
  deleteGist: function( req, callback ){
    var uri = baseUrl + "/" + req.body.id + "?access_token=" + accessToken
      request({
	uri: uri,
	method: 'DELETE',
	headers: {
	  'User-Agent': 'gist-pro'
	}
      }, function(err, response, body){
	if( callback )
	  callback( )
      })
  }
}
}
