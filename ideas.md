- /jshawl/my-filename.md
- => User.gists.where(filename: 'gizt-my-filename.md')

## /

## GET /jshawl
  // github().gists()
  // gists ->
       since = session.since ? session.since : the beginning of time
       getAllGists({ since: since },function( gists ){
         session.since = new Date() 
	 session.gists.push( gists )
	 render('gists', {gists: session.gists})
       })
       
  //     recursively get all gists since session.since
  //     session.since = timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
  //     user.gists.each(:+)
  //   else
  //     recursively get all gists
  //     session.since = timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
  //     user.gists.each(:+)
  //   end
  //   user should have a session variable containing all gists
  //   if session['since'] {
  //      
  //   }

## POST /jshawl
  // :string, :filename
  // filename is optional
  // if filename
    // filename = yyyy-my-dd-$filename.md
    // 301 /jshawl/$filename

## GET /jshawl/new
  // just a textarea that saves to local storage.
  // save posts to /jshawl
