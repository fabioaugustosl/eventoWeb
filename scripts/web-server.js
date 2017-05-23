var express = require('express');
//var path = require('path');
var app = express();
//var rootPath = path.normalize(__dirname + '/../');



app.use(express.static('./public'));

/*app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
*/
//

 app.get('/*', function(req, res){
 	res.redirect('view/index.html');
 });

app.listen(8000, function(err){
	if(err){
		console.log(err);
	}

	console.log('Listening on port 8000'); 
});