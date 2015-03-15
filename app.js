var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var sesh = require('express-session')
var routes = require('./routes')
var config = require('./config')
var exphbs = require('express-handlebars');

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sesh({secret: config.session_secret}))
app.use(function(req,res,next){
  res.locals.session = req.session;
  res.locals.callback_uri = config.callback_uri
  res.locals.client_id = config.client_id
  next();
});
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', routes.index)
app.get('/callback', routes.callback)
app.get('/login', routes.login)
app.get('/logout', routes.logout)
app.get('/:id', routes.show)
app.get('/:id/:filename', routes.showFile)
app.post('/update', routes.updateFile)

var server = app.listen(4000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Listening at http://%s:%s', host, port)
})

module.exports = app;
