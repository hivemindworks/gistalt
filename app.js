var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var sesh = require('express-session')
var sass = require('node-sass-middleware')
var routes = require('./routes')
var config = require('./config')
var path = require('path')
var exphbs = require('express-handlebars')

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
  next();
});

app.use(sass({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/prefix'
}));

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
app.post('/fork', routes.fork)

module.exports = app;
