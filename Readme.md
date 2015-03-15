## Local Setup
First, create a new file called config.js, like this one:

```js
//config.js
module.exports = {
  session_secret: 'your secret',
  client_id: 'your github client id',
  client_secret: 'your github client secret',
  callback_uri: 'http://localhost:3000/callback'
}

    $ git clone https://github.com/jshawl/gizt
    $ cd gizt
    $ npm install
    $ npm start


