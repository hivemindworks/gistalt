var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var sesh = require('express-session')
var routes = require('./routes')
var config = require('./config')

app.use(cookieParser())
app.use(sesh({secret: config.session_secret}))

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.get('/', routes.index)
app.get('/callback', routes.callback)
app.get('/:id', routes.show)
app.get('/:id/:filename', routes.showFile)

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Listening at http://%s:%s', host, port)
})