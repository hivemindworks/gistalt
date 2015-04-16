var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var sesh = require('express-session')
var routes = require('./routes')
var config = require('./config')
var path = require('path')
var exphbs = require('express-handlebars')
var fs = require('fs')
var app = express()

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sesh({
  secret: config.session_secret,
  saveUninitialized: true,
  resave: true
}))

app.use(function(req,res,next){
  res.locals.session = req.session;
  res.locals.callback_uri = config.callback_uri
  res.locals.client_id = config.client_id
  res.locals.mtime = fs.readFileSync('./.mtime','utf8')
  next();
});

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', routes.index)
app.get('/callback', routes.callback)
app.get('/login', routes.login)
app.get('/logout', routes.logout)
app.post('/update/:format?', routes.updateFile)
app.get('/new', routes.newGist)
app.post('/create', routes.create)
app.post('/fork/:format?', routes.fork)
app.post('/delete', routes.deleteGist )
app.get('/:id/:filename', routes.showFile)
app.get('/:id/:filename/preview', routes.preview)
app.get('*', function(req, res){
    res.status(404).render('404');
});

module.exports = app;

