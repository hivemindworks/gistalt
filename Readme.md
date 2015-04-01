## Local Setup
First, clone the repo

    $ git clone https://github.com/jshawl/gizt
    $ cd gizt

You'll then need to register a new oAuth application: https://github.com/settings/applications/new
Name: Gizt
Homepage URL: http://localhost:4000
Callback URL: http://localhost:4000/callback

Then create a config.js file like the one below with your credentials

```js
//config.js
module.exports = {
  session_secret: 'Make up a phrase. e.g. "jedi mind tricks"',
  client_id: 'your github client id',
  client_secret: 'your github client secret',
  callback_uri: 'http://localhost:4000/callback'
}
```

Then, install dependencies and run the app

    $ npm install
    $ gulp

(Gulp will run nodemon and will compile sass on the fly)


