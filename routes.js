var request = require('request')

module.exports = {
  index: function( req, res ){
    res.render('index')	 
  },
  callback: function( req, res ){
    console.log( req.query.code )	    
    request.post('https://github.com/login/oauth/access_token',{
      code: req.query.code,
      client_id: config.client_id,
      client_secret: config.client_secret
    })
  }
}