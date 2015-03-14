var express = require('express')
var app = express()
var routes = require('./routes')

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.get('/', routes.index)
app.get('/callback', routes.callback)

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Listening at http://%s:%s', host, port)
})